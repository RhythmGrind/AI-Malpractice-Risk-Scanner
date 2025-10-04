from typing import Dict, Any
from anthropic import Anthropic
from app.core.config import settings
from app.agents.state import AgentState
from app.schemas import PatientInfo, IdentifiedRisk, RiskType, RiskLevel
from app.services import vector_db, clinical_standards
import json


class RiskAssessmentAgent:
    """Multi-step agent for risk assessment using LangGraph workflow."""

    def __init__(self):
        self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = "claude-sonnet-4-20250514"

    def extract_patient_info(self, state: AgentState) -> AgentState:
        """Step 1: Extract structured patient information from case description."""

        prompt = f"""You are a medical information extraction expert. Extract structured information from this case description.

Case Description:
{state['case_description']}

Extract and return ONLY a JSON object with these fields:
- age: patient age (number or null)
- gender: patient gender (string or null)
- chief_complaint: main complaint (string)
- tests_performed: list of tests/examinations done (array of strings)
- tests_not_performed: list of tests that were NOT done but mentioned (array of strings)
- treatment_given: list of treatments provided (array of strings)
- disposition: what happened to patient (e.g., "sent home", "admitted", null)

Return ONLY valid JSON, no other text."""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            patient_data = json.loads(content)

            state['patient_info'] = PatientInfo(**patient_data)
            print("✅ Step 1: Extracted patient info")

        except Exception as e:
            print(f"❌ Error extracting patient info: {e}")
            state['error'] = str(e)

        return state

    def find_similar_cases(self, state: AgentState) -> AgentState:
        """Step 2: Find similar malpractice cases using RAG."""

        try:
            similar_cases = vector_db.search_similar_cases(
                query=state['case_description'],
                n_results=5
            )

            state['similar_cases'] = similar_cases
            print(f"✅ Step 2: Found {len(similar_cases)} similar cases")

        except Exception as e:
            print(f"❌ Error finding similar cases: {e}")
            state['similar_cases'] = []

        return state

    def identify_risks(self, state: AgentState) -> AgentState:
        """Step 3: Identify specific risks by comparing to clinical standards."""

        patient_info = state.get('patient_info')
        similar_cases = state.get('similar_cases', [])

        if not patient_info:
            state['identified_risks'] = []
            return state

        # Get clinical standard for chief complaint
        chief_complaint = patient_info.chief_complaint
        standard = clinical_standards.get_standard(chief_complaint)

        prompt = f"""You are a medical malpractice risk expert. Identify ALL potential legal risks in this case.

PATIENT CASE:
{state['case_description']}

EXTRACTED INFO:
- Chief Complaint: {patient_info.chief_complaint}
- Tests Performed: {', '.join(patient_info.tests_performed) if patient_info.tests_performed else 'None'}
- Tests NOT Performed: {', '.join(patient_info.tests_not_performed) if patient_info.tests_not_performed else 'None'}
- Treatment: {', '.join(patient_info.treatment_given) if patient_info.treatment_given else 'None'}
- Disposition: {patient_info.disposition or 'Unknown'}

CLINICAL STANDARD OF CARE:
Required Workup: {standard.get('required_workup', [])}
Red Flags: {standard.get('red_flags', [])}
Must Rule Out: {standard.get('must_rule_out', [])}
Documentation Requirements: {standard.get('documentation_requirements', [])}

SIMILAR LEGAL CASES:
{self._format_similar_cases(similar_cases[:3])}

Analyze this case and identify ALL risks. For each risk, return a JSON object with:
- type: one of ["missed_diagnosis", "inadequate_workup", "documentation_deficiency", "treatment_error"]
- severity: number from 1-10 (10 = highest risk)
- description: specific problem identified
- standard_violated: which standard of care was violated
- legal_precedent: cite similar case if applicable (or null)
- mitigation: specific action to reduce this risk

Return a JSON array of risk objects. Be thorough and identify ALL gaps."""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=2048,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            risks_data = json.loads(content)

            identified_risks = [IdentifiedRisk(**risk) for risk in risks_data]
            state['identified_risks'] = identified_risks
            print(f"✅ Step 3: Identified {len(identified_risks)} risks")

        except Exception as e:
            print(f"❌ Error identifying risks: {e}")
            state['identified_risks'] = []

        return state

    def calculate_risk_score(self, state: AgentState) -> AgentState:
        """Step 4: Calculate overall risk score."""

        risks = state.get('identified_risks', [])

        if not risks:
            state['risk_score'] = 0.0
            state['risk_level'] = RiskLevel.LOW.value
            return state

        # Calculate average of top 3 most severe risks
        sorted_risks = sorted(risks, key=lambda r: r.severity, reverse=True)
        top_risks = sorted_risks[:3]
        avg_severity = sum(r.severity for r in top_risks) / len(top_risks)

        state['risk_score'] = round(avg_severity, 1)

        # Determine risk level
        if avg_severity >= 7:
            state['risk_level'] = RiskLevel.HIGH.value
        elif avg_severity >= 4:
            state['risk_level'] = RiskLevel.MEDIUM.value
        else:
            state['risk_level'] = RiskLevel.LOW.value

        # Estimate liability based on similar cases
        similar_cases = state.get('similar_cases', [])
        if similar_cases:
            plaintiff_wins = sum(1 for c in similar_cases if 'plaintiff' in c.verdict.lower())
            state['plaintiff_win_probability'] = round(plaintiff_wins / len(similar_cases), 2)

        print(f"✅ Step 4: Risk score = {state['risk_score']}/10 ({state['risk_level']})")

        return state

    def generate_mitigation(self, state: AgentState) -> AgentState:
        """Step 5: Generate actionable mitigation steps and protective documentation."""

        risks = state.get('identified_risks', [])
        patient_info = state.get('patient_info')

        if not risks:
            state['action_items'] = []
            state['protective_documentation'] = ""
            return state

        prompt = f"""You are a medical-legal expert. Generate protective actions and documentation for this case.

CASE: {state['case_description']}

IDENTIFIED RISKS:
{self._format_risks(risks)}

Generate two things:

1. ACTION ITEMS: A list of specific, actionable steps the physician should take NOW to reduce risk. Be concrete and medical-specific.

2. PROTECTIVE DOCUMENTATION: A sample note the physician can add to the medical record that includes:
   - Full differential diagnosis considered
   - Documentation of workup and reasoning
   - Shared decision-making discussion
   - Return precautions given
   - Use protective legal language

Return as JSON:
{{
  "action_items": ["action 1", "action 2", ...],
  "protective_documentation": "full note text here"
}}"""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=2048,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            mitigation_data = json.loads(content)

            state['action_items'] = mitigation_data.get('action_items', [])
            state['protective_documentation'] = mitigation_data.get('protective_documentation', '')

            print(f"✅ Step 5: Generated {len(state['action_items'])} action items")

        except Exception as e:
            print(f"❌ Error generating mitigation: {e}")
            state['action_items'] = []
            state['protective_documentation'] = ""

        return state

    def _format_similar_cases(self, cases) -> str:
        """Format similar cases for prompt."""
        if not cases:
            return "No similar cases found."

        formatted = []
        for case in cases:
            formatted.append(
                f"- {case.case_name} ({case.year}): {case.facts[:200]}... "
                f"Verdict: {case.verdict}, Key Error: {case.key_error}"
            )
        return "\n".join(formatted)

    def _format_risks(self, risks) -> str:
        """Format risks for prompt."""
        formatted = []
        for i, risk in enumerate(risks, 1):
            formatted.append(
                f"{i}. [{risk.type.value}] Severity {risk.severity}/10: {risk.description}"
            )
        return "\n".join(formatted)


# Singleton instance
risk_agent = RiskAssessmentAgent()
