from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from enum import Enum


class RiskLevel(str, Enum):
    """Risk level classification."""
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"


class RiskType(str, Enum):
    """Type of identified risk."""
    MISSED_DIAGNOSIS = "missed_diagnosis"
    INADEQUATE_WORKUP = "inadequate_workup"
    DOCUMENTATION_DEFICIENCY = "documentation_deficiency"
    TREATMENT_ERROR = "treatment_error"


class Priority(str, Enum):
    """Priority level for recommendations."""
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class Category(str, Enum):
    """Category for recommendations."""
    DOCUMENTATION = "Documentation"
    CLINICAL_DECISION = "Clinical Decision"
    FOLLOW_UP = "Follow-up"
    COMMUNICATION = "Communication"


class EvidenceType(str, Enum):
    """Type of evidence."""
    TEXT_ANALYSIS = "Text Analysis"
    PATTERN_RECOGNITION = "Pattern Recognition"
    STANDARD_COMPLIANCE = "Standard Compliance"
    RISK_FACTOR = "Risk Factor"


class Impact(str, Enum):
    """Impact level."""
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


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


class Recommendation(BaseModel):
    """Actionable recommendation."""
    id: str
    priority: Priority
    category: Category
    title: str
    description: str
    action: str


class EvidenceItem(BaseModel):
    """Supporting evidence item."""
    id: str
    type: EvidenceType
    excerpt: str
    analysis: str
    confidence: int = Field(ge=0, le=100)
    impact: Impact


class AnalysisMetrics(BaseModel):
    """Analysis metrics."""
    totalWords: int
    keyPhrases: int
    riskIndicators: int
    confidenceScore: int = Field(ge=0, le=100)


class RiskVisualizationData(BaseModel):
    """Risk visualization data point."""
    category: str
    risk: int = Field(ge=0, le=100)
    impact: int = Field(ge=0, le=100)
    confidence: int = Field(ge=0, le=100)
    color: str


class CaseAnalysisRequest(BaseModel):
    """Request for case analysis."""
    case_description: str = Field(..., min_length=10)


class CaseAnalysisResponse(BaseModel):
    """Response with full risk analysis."""
    # Legacy fields (keep for backward compatibility)
    patient_info: Optional[PatientInfo] = None
    identified_risks: List[IdentifiedRisk] = Field(default_factory=list)
    similar_cases: List[SimilarCase] = Field(default_factory=list)
    action_items: List[str] = Field(default_factory=list)
    protective_documentation: str = ""
    estimated_liability_range: Optional[str] = None
    plaintiff_win_probability: Optional[float] = None

    # Frontend-specific fields
    riskScore: int = Field(ge=0, le=100)
    riskLevel: RiskLevel
    keyFindings: List[str] = Field(default_factory=list)
    recommendations: List[Recommendation] = Field(default_factory=list)
    evidence: List[EvidenceItem] = Field(default_factory=list)
    analysisMetrics: AnalysisMetrics
    riskVisualizationData: List[RiskVisualizationData] = Field(default_factory=list)
