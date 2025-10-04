import streamlit as st
import requests
import json
import pandas as pd
from typing import List, Optional, Dict, Any

# --- Configuration ---
BACKEND_URL = "http://127.0.0.1:8000"
ANALYZE_ENDPOINT = f"{BACKEND_URL}/analyze"
HEALTH_ENDPOINT = f"{BACKEND_URL}/health"

# --- Test Mode ---
def check_backend_availability():
    """Check if the backend API is available."""
    try:
        response = requests.get(HEALTH_ENDPOINT, timeout=2)
        return response.status_code == 200
    except requests.ConnectionError:
        return False

IS_TEST_MODE = not check_backend_availability()

def get_mock_data() -> Dict[str, Any]:
    """Return mock data for UI testing when the backend is unavailable."""
    return {
        "patient_info": {
            "age": 45,
            "gender": "Male",
            "chief_complaint": "Chest pain and shortness of breath.",
            "tests_performed": ["ECG", "Troponin levels"],
            "tests_not_performed": ["Chest X-ray", "D-dimer"],
            "treatment_given": ["Aspirin", "Nitroglycerin"],
            "disposition": "Discharged home"
        },
        "identified_risks": [
            {
                "type": "missed_diagnosis",
                "severity": 8.5,
                "description": "Failure to rule out pulmonary embolism in a patient with chest pain and shortness of breath.",
                "standard_violated": "Standard of care requires a thorough workup for potentially life-threatening conditions.",
                "legal_precedent": "Smith v. Jones (2018)",
                "mitigation": "Perform a D-dimer test or CT angiogram to rule out pulmonary embolism."
            }
        ],
        "similar_cases": [
            {
                "case_name": "Doe v. General Hospital",
                "year": 2020,
                "specialty": "Emergency Medicine",
                "facts": "Patient presented with similar symptoms, was discharged, and later died from a massive pulmonary embolism.",
                "verdict": "Plaintiff win",
                "key_error": "Inadequate workup for PE.",
                "settlement": "$2.5 Million",
                "similarity_score": 0.88
            }
        ],
        "risk_score": 8.2,
        "risk_level": "high",
        "action_items": [
            "Immediately recall the patient for further evaluation.",
            "Perform a CT angiogram to definitively rule out pulmonary embolism.",
            "Document a clear rationale for all diagnostic decisions."
        ],
        "protective_documentation": "Patient advised to return immediately if symptoms worsen. Documented differential diagnosis including pulmonary embolism, and noted patient's initial refusal of further testing (if applicable)."
    }

# --- UI Components ---
def display_risk_score(score: float, level: str):
    """Display the overall risk score and level."""
    st.subheader("Overall Risk Score")
    
    color_map = {"low": "green", "medium": "orange", "high": "red"}
    level_color = color_map.get(level, "gray")
    
    st.markdown(
        f"""
        <div style="
            text-align: center; 
            border: 2px solid {level_color}; 
            border-radius: 10px; 
            padding: 20px;
        ">
            <h1 style="color:{level_color}; font-size: 4em; margin: 0;">{score:.1f}</h1>
            <h3 style="color:{level_color}; text-transform: uppercase; margin: 0;">{level} Risk</h3>
        </div>
        """,
        unsafe_allow_html=True
    )

def display_identified_risks(risks: List[Dict[str, Any]]):
    """Display a list of identified risks."""
    st.subheader("Identified Risks")
    if not risks:
        st.info("No specific risks were identified.")
        return
        
    for risk in risks:
        with st.expander(f"**{risk['type'].replace('_', ' ').title()}**: {risk['description']}"):
            st.markdown(f"**Severity:** `{risk['severity']}/10`")
            st.markdown(f"**Standard Violated:** {risk['standard_violated']}")
            st.markdown(f"**Suggested Mitigation:** {risk['mitigation']}")
            if risk.get('legal_precedent'):
                st.markdown(f"**Legal Precedent:** *{risk['legal_precedent']}*")

def display_similar_cases(cases: List[Dict[str, Any]]):
    """Display a table of similar malpractice cases."""
    st.subheader("Similar Malpractice Cases")
    if not cases:
        st.info("No similar cases found in the database.")
        return
        
    df = pd.DataFrame(cases)
    st.dataframe(df[[
        'case_name', 'year', 'specialty', 'key_error', 'verdict', 'settlement', 'similarity_score'
    ]])

def display_protective_actions(actions: List[str], documentation: str):
    """Display recommended actions and documentation notes."""
    st.subheader("Protective Actions & Documentation")
    
    st.markdown("**Recommended Action Items:**")
    if actions:
        for i, action in enumerate(actions, 1):
            st.markdown(f"{i}. {action}")
    else:
        st.info("No specific action items recommended.")

    st.markdown("**Protective Documentation Advice:**")
    st.info(documentation or "No specific documentation advice provided.")

# --- Main Application ---
def main():
    st.set_page_config(page_title="AI Malpractice Risk Scanner", layout="wide")

    st.title("🩺 AI Malpractice Risk Scanner")
    st.caption("Analyze clinical notes to identify potential malpractice risks.")

    if IS_TEST_MODE:
        st.warning(
            "**Test Mode:** The backend API is not available. Displaying mock data. "
            "To run a full analysis, please start the backend server."
        )

    case_description = st.text_area(
        "Enter the clinical case description here:",
        height=250,
        placeholder="e.g., 'A 45-year-old male presents with chest pain...'"
    )

    if st.button("Analyze Case", type="primary", use_container_width=True):
        if not case_description.strip():
            st.error("Case description cannot be empty.")
            return

        with st.spinner("Analyzing... This may take a moment."):
            try:
                if IS_TEST_MODE:
                    response_data = get_mock_data()
                else:
                    payload = {"case_description": case_description}
                    response = requests.post(ANALYZE_ENDPOINT, json=payload, timeout=120)
                    response.raise_for_status()
                    response_data = response.json()

                # Store response in session state to prevent re-running on every interaction
                st.session_state['analysis_result'] = response_data

            except requests.exceptions.RequestException as e:
                st.error(f"API Error: Could not connect to the backend. Details: {e}")
                return
            except Exception as e:
                st.error(f"An unexpected error occurred: {e}")
                return

    if 'analysis_result' in st.session_state:
        result = st.session_state['analysis_result']
        
        col1, col2 = st.columns([1, 2])
        
        with col1:
            display_risk_score(result['risk_score'], result['risk_level'])
            st.subheader("Patient Summary")
            st.json(result['patient_info'])

        with col2:
            display_protective_actions(result['action_items'], result['protective_documentation'])
            display_identified_risks(result['identified_risks'])
            display_similar_cases(result['similar_cases'])


if __name__ == "__main__":
    main()