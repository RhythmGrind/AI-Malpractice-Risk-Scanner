from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings."""

    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True

    # AI Service
    ANTHROPIC_API_KEY: str

    # Vector Database
    CHROMA_DB_PATH: str = "./data/chroma_db"

    # Data Files
    CASES_DATA_PATH: str = "./data/malpractice_cases.csv"
    STANDARDS_DATA_PATH: str = "./data/clinical_standards.json"

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Application
    APP_NAME: str = "AI Malpractice Risk Scanner"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
