from fastapi import APIRouter, HTTPException
from app.schemas import (
    CaseAnalysisRequest,
    CaseAnalysisResponse,
    Recommendation,
    EvidenceItem,
    AnalysisMetrics,
    RiskVisualizationData,
    Priority,
    Category,
    EvidenceType,
    Impact,
    RiskLevel
)
from app.agents import risk_assessment_app
from app.services import vector_db
from typing import Dict, Any

router = APIRouter()


@router.post("/analyze", response_model=CaseAnalysisResponse)
async def analyze_case(request: CaseAnalysisRequest):
    """
    Analyze a medical case for malpractice risk.

    This endpoint runs the full multi-agent workflow:
    1. Extract patient information
    2. Find similar legal cases
    3. Identify risks
    4. Calculate risk score
    5. Generate mitigation steps
    """
    try:
        # Initialize state
        initial_state = {
            "case_description": request.case_description,
            "patient_info": None,
            "similar_cases": None,
            "identified_risks": None,
            "risk_score": None,
            "risk_level": None,
            "action_items": None,
            "protective_documentation": None,
            "estimated_liability_range": None,
            "plaintiff_win_probability": None,
            "error": None
        }

        # Run the workflow
        final_state = risk_assessment_app.invoke(initial_state)

        # Check for errors
        if final_state.get('error'):
            raise HTTPException(status_code=500, detail=final_state['error'])

        # Construct response
        response = CaseAnalysisResponse(
            patient_info=final_state['patient_info'],
            identified_risks=final_state.get('identified_risks', []),
            similar_cases=final_state.get('similar_cases', []),
            risk_score=final_state.get('risk_score', 0.0),
            risk_level=final_state.get('risk_level', 'low'),
            action_items=final_state.get('action_items', []),
            protective_documentation=final_state.get('protective_documentation', ''),
            estimated_liability_range=final_state.get('estimated_liability_range'),
            plaintiff_win_probability=final_state.get('plaintiff_win_probability')
        )

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "AI Malpractice Risk Scanner",
        "version": "1.0.0"
    }


@router.get("/stats")
async def get_stats() -> Dict[str, Any]:
    """Get database statistics."""
    try:
        stats = vector_db.get_collection_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-mock", response_model=CaseAnalysisResponse)
async def analyze_case_mock(request: CaseAnalysisRequest):
    """
    Mock endpoint for testing frontend integration.
    Returns sample data matching the frontend's expected structure.
    """
    # Count words in the case description
    word_count = len(request.case_description.split())

    # Generate mock data
    mock_response = CaseAnalysisResponse(
        # Frontend-specific fields (primary)
        riskScore=65,
        riskLevel=RiskLevel.MODERATE,
        keyFindings=[
            "Incomplete documentation of patient's cardiac history",
            "Delayed administration of thrombolytics",
            "Missing consent documentation for emergency procedure",
            "Insufficient monitoring post-procedure notes"
        ],
        recommendations=[
            Recommendation(
                id="1",
                priority=Priority.HIGH,
                category=Category.DOCUMENTATION,
                title="Complete Missing Cardiac History",
                description="Patient's previous cardiac events and medications are not fully documented, which could impact treatment decisions.",
                action="Review and document complete cardiac history including previous MI, interventions, and current medications within 24 hours."
            ),
            Recommendation(
                id="2",
                priority=Priority.HIGH,
                category=Category.CLINICAL_DECISION,
                title="Document Thrombolytic Decision Timeline",
                description="The decision-making process and timing for thrombolytic therapy administration needs clearer documentation.",
                action="Add detailed notes explaining the 45-minute delay and clinical rationale for treatment timing."
            ),
            Recommendation(
                id="3",
                priority=Priority.MEDIUM,
                category=Category.COMMUNICATION,
                title="Enhance Family Communication Record",
                description="Documentation of family communication during emergency procedure is incomplete.",
                action="Document all family communications and consent discussions, including verbal consent for emergency situation."
            ),
            Recommendation(
                id="4",
                priority=Priority.LOW,
                category=Category.FOLLOW_UP,
                title="Schedule Comprehensive Follow-up",
                description="Post-procedure follow-up planning could be more detailed and specific.",
                action="Document specific follow-up timeline with cardiology and primary care within discharge planning."
            )
        ],
        evidence=[
            EvidenceItem(
                id="1",
                type=EvidenceType.TEXT_ANALYSIS,
                excerpt="History of diabetes and hypertension",
                analysis="Incomplete cardiac risk factor documentation. Missing details about diabetes control, duration, and complications which are critical for malpractice risk assessment.",
                confidence=85,
                impact=Impact.HIGH
            ),
            EvidenceItem(
                id="2",
                type=EvidenceType.PATTERN_RECOGNITION,
                excerpt="Patient taken to cath lab for emergency PCI",
                analysis="Standard of care met for STEMI management with timely PCI. However, documentation lacks door-to-balloon time which is a key quality metric.",
                confidence=92,
                impact=Impact.MEDIUM
            ),
            EvidenceItem(
                id="3",
                type=EvidenceType.STANDARD_COMPLIANCE,
                excerpt="Administered aspirin 325mg, started on heparin protocol",
                analysis="Appropriate dual antiplatelet therapy initiated. Medications and dosages align with current guidelines for acute coronary syndrome management.",
                confidence=95,
                impact=Impact.LOW
            ),
            EvidenceItem(
                id="4",
                type=EvidenceType.RISK_FACTOR,
                excerpt="EKG showed ST elevations in leads II, III, aVF",
                analysis="Clear documentation of inferior STEMI. EKG findings properly documented, but missing right-sided leads evaluation for posterior involvement.",
                confidence=88,
                impact=Impact.MEDIUM
            )
        ],
        analysisMetrics=AnalysisMetrics(
            totalWords=word_count,
            keyPhrases=12,
            riskIndicators=4,
            confidenceScore=87
        ),
        riskVisualizationData=[
            RiskVisualizationData(
                category="Documentation",
                risk=75,
                impact=85,
                confidence=92,
                color="rgba(239, 68, 68, 0.8)"
            ),
            RiskVisualizationData(
                category="Clinical Decision",
                risk=60,
                impact=90,
                confidence=88,
                color="rgba(234, 179, 8, 0.8)"
            ),
            RiskVisualizationData(
                category="Communication",
                risk=45,
                impact=70,
                confidence=85,
                color="rgba(34, 197, 94, 0.8)"
            ),
            RiskVisualizationData(
                category="Follow-up",
                risk=35,
                impact=60,
                confidence=80,
                color="rgba(59, 130, 246, 0.8)"
            ),
            RiskVisualizationData(
                category="Medication",
                risk=25,
                impact=95,
                confidence=95,
                color="rgba(168, 85, 247, 0.8)"
            )
        ],
        # Legacy fields (optional, for backward compatibility)
        action_items=[
            "Review and document complete cardiac history",
            "Add detailed notes explaining treatment timing",
            "Document family communications",
            "Document follow-up timeline"
        ],
        protective_documentation="Ensure all clinical decisions are documented with timestamps and rationale.",
        estimated_liability_range="$500,000 - $2,000,000",
        plaintiff_win_probability=0.45
    )

    return mock_response
