from fastapi import APIRouter, HTTPException
from app.schemas import CaseAnalysisRequest, CaseAnalysisResponse
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
