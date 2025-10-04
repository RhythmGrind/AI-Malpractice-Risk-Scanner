from typing import TypedDict, List, Optional
from app.schemas import PatientInfo, IdentifiedRisk, SimilarCase


class AgentState(TypedDict):
    """State object passed between agent nodes."""

    # Input
    case_description: str

    # Step 1: Extract patient info
    patient_info: Optional[PatientInfo]

    # Step 2: Find similar cases
    similar_cases: Optional[List[SimilarCase]]

    # Step 3: Identify risks
    identified_risks: Optional[List[IdentifiedRisk]]

    # Step 4: Calculate risk score
    risk_score: Optional[float]
    risk_level: Optional[str]

    # Step 5: Generate mitigation
    action_items: Optional[List[str]]
    protective_documentation: Optional[str]

    # Additional metadata
    estimated_liability_range: Optional[str]
    plaintiff_win_probability: Optional[float]

    # Error handling
    error: Optional[str]
