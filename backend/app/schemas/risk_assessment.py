from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class RiskLevel(str, Enum):
    """Risk level classification."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class RiskType(str, Enum):
    """Type of identified risk."""
    MISSED_DIAGNOSIS = "missed_diagnosis"
    INADEQUATE_WORKUP = "inadequate_workup"
    DOCUMENTATION_DEFICIENCY = "documentation_deficiency"
    TREATMENT_ERROR = "treatment_error"


class PatientInfo(BaseModel):
    """Extracted patient information."""
    age: Optional[int] = None
    gender: Optional[str] = None
    chief_complaint: str
    tests_performed: List[str] = Field(default_factory=list)
    tests_not_performed: List[str] = Field(default_factory=list)
    treatment_given: List[str] = Field(default_factory=list)
    disposition: Optional[str] = None


class SimilarCase(BaseModel):
    """Similar malpractice case."""
    case_name: str
    year: int
    specialty: str
    facts: str
    verdict: str
    key_error: str
    settlement: Optional[str] = None
    similarity_score: float


class IdentifiedRisk(BaseModel):
    """Individual risk identified."""
    type: RiskType
    severity: float = Field(ge=0, le=10)
    description: str
    standard_violated: str
    legal_precedent: Optional[str] = None
    mitigation: str


class CaseAnalysisRequest(BaseModel):
    """Request for case analysis."""
    case_description: str = Field(..., min_length=10)


class CaseAnalysisResponse(BaseModel):
    """Response with full risk analysis."""
    patient_info: PatientInfo
    identified_risks: List[IdentifiedRisk]
    similar_cases: List[SimilarCase]
    risk_score: float = Field(ge=0, le=10)
    risk_level: RiskLevel
    action_items: List[str]
    protective_documentation: str
    estimated_liability_range: Optional[str] = None
    plaintiff_win_probability: Optional[float] = None
