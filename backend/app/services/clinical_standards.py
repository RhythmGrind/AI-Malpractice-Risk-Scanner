import json
from typing import Dict, Any, List
from app.core.config import settings


class ClinicalStandardsService:
    """Service for loading and querying clinical standards."""

    def __init__(self):
        self.standards: Dict[str, Any] = {}

    def load_standards(self, json_path: str = None):
        """Load clinical standards from JSON file."""
        if json_path is None:
            json_path = settings.STANDARDS_DATA_PATH

        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                self.standards = json.load(f)
            print(f"✅ Loaded clinical standards for {len(self.standards)} chief complaints")
        except FileNotFoundError:
            print(f"⚠️  Standards file not found at {json_path}, using empty standards")
            self.standards = {}
        except Exception as e:
            print(f"❌ Error loading standards: {e}")
            self.standards = {}

    def get_standard(self, chief_complaint: str) -> Dict[str, Any]:
        """Get clinical standard for a specific chief complaint."""
        # Normalize the key (lowercase, replace spaces with underscores)
        key = chief_complaint.lower().replace(' ', '_')
        return self.standards.get(key, {})

    def get_required_workup(self, chief_complaint: str) -> List[str]:
        """Get required workup for a chief complaint."""
        standard = self.get_standard(chief_complaint)
        return standard.get('required_workup', [])

    def get_red_flags(self, chief_complaint: str) -> List[str]:
        """Get red flags for a chief complaint."""
        standard = self.get_standard(chief_complaint)
        return standard.get('red_flags', [])

    def get_must_rule_out(self, chief_complaint: str) -> List[str]:
        """Get must-rule-out diagnoses for a chief complaint."""
        standard = self.get_standard(chief_complaint)
        return standard.get('must_rule_out', [])

    def get_risk_scores(self, chief_complaint: str) -> Dict[str, Any]:
        """Get risk score information for a chief complaint."""
        standard = self.get_standard(chief_complaint)
        return standard.get('risk_scores', {})

    def get_documentation_requirements(self, chief_complaint: str) -> List[str]:
        """Get documentation requirements for a chief complaint."""
        standard = self.get_standard(chief_complaint)
        return standard.get('documentation_requirements', [])

    def get_all_complaints(self) -> List[str]:
        """Get list of all available chief complaints."""
        return list(self.standards.keys())


# Singleton instance
clinical_standards = ClinicalStandardsService()
