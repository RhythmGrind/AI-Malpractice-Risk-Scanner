# AI Malpractice Risk Scanner

AI-powered medical malpractice risk assessment system that analyzes clinical cases to identify potential liability risks and provide actionable recommendations.

> **"Spell-check for malpractice risk"** - Prevent lawsuits before they happen

## 📚 Documentation

- **[Executive Summary](EXECUTIVE_SUMMARY.md)** - One-page overview for investors/partners
- **[Full Pitch](PITCH.md)** - Complete pitch deck with market analysis
- **[Technical Workflow](WORKFLOW.md)** - Detailed system architecture and agent workflow
- **[Quick Start](QUICKSTART.md)** - Get running in 3 minutes

## Overview

This system helps healthcare providers identify potential malpractice risks in clinical documentation by:
- Analyzing patient cases using AI
- Identifying risk patterns based on historical malpractice cases
- Providing specific recommendations to mitigate liability
- Generating protective documentation suggestions

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- Anthropic API key (optional for mock testing)

### 1. Clone and Setup

```bash
cd AI-Malpractice-Risk-Scanner

# Create environment file
cp .env.example .env

# Edit .env and add your Anthropic API key (optional for mock mode)
nano .env
```

### 2. Start Services

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 4. Test the Mock API

The mock endpoint works without an API key:

```bash
curl -X POST http://localhost:8000/api/v1/analyze-mock \
  -H "Content-Type: application/json" \
  -d '{"case_description":"Patient presented with chest pain..."}'
```

## Technology Stack

### Backend
- **Framework**: FastAPI
- **AI Agent**: LangGraph with Claude Sonnet 4
- **Vector Database**: ChromaDB
- **Language**: Python 3.11

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI + Tailwind CSS
- **Visualization**: Recharts

## Project Structure

```
.
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── agents/         # LangGraph multi-agent workflow
│   │   ├── api/            # API routes
│   │   ├── schemas/        # Pydantic models
│   │   └── services/       # Business logic
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   └── styles/        # CSS and themes
│   ├── Dockerfile
│   └── package.json
│
├── data/                  # Case data and embeddings
├── docker-compose.yml     # Docker orchestration
└── .env                   # Environment variables
```

## API Endpoints

### Health Check
```bash
GET /api/v1/health
```

### Analyze Case (Mock)
```bash
POST /api/v1/analyze-mock
Content-Type: application/json

{
  "case_description": "Clinical case description here..."
}
```

### Analyze Case (Real AI)
```bash
POST /api/v1/analyze
Content-Type: application/json

{
  "case_description": "Clinical case description here..."
}
```

## Response Format

```json
{
  "riskScore": 65,
  "riskLevel": "MODERATE",
  "keyFindings": [...],
  "recommendations": [...],
  "evidence": [...],
  "analysisMetrics": {
    "totalWords": 89,
    "keyPhrases": 12,
    "riskIndicators": 4,
    "confidenceScore": 87
  },
  "riskVisualizationData": [...]
}
```

## Development

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild
```bash
docker-compose up --build -d
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Anthropic API Key (required for real AI analysis)
ANTHROPIC_API_KEY=your_api_key_here
```

## Features

- ✅ Real-time case analysis
- ✅ Risk visualization dashboard
- ✅ Actionable recommendations
- ✅ Historical case comparison
- ✅ Documentation suggestions
- ✅ Mock mode for testing without API key

## License

This project is for educational and research purposes only. Not intended for production medical use without proper validation and compliance review.

## Support

For issues or questions, please open an issue on GitHub.
