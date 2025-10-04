# AI Malpractice Risk Scanner - Setup Guide

## Project Structure

```
AI-Malpractice-Risk-Scanner/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── agents/            # LangGraph agents
│   │   │   ├── state.py       # Agent state definition
│   │   │   ├── risk_agent.py  # Risk assessment agent
│   │   │   └── workflow.py    # LangGraph workflow
│   │   ├── api/               # API routes
│   │   ├── core/              # Configuration
│   │   ├── models/            # Data models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/          # Business logic
│   │       ├── vector_db.py   # ChromaDB service
│   │       └── clinical_standards.py
│   ├── main.py                # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile
│
├── frontend/                  # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API client
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Helper functions
│   ├── package.json
│   └── Dockerfile
│
├── data/                      # Data directory
│   ├── malpractice_cases.csv  # (You need to create this)
│   ├── clinical_standards.json # (You need to create this)
│   └── chroma_db/             # Vector database (auto-created)
│
└── docker-compose.yml         # Docker orchestration

```

## Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (optional)
- Anthropic API Key

## Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-Malpractice-Risk-Scanner
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. **Data files already included**
   - `data/malpractice_cases.csv` ✅ (already in project)
   - `data/clinical_standards.json` ✅ (already in project)

4. **Start services**
   ```bash
   docker-compose up -d
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Option 2: Local Development Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file**
   ```bash
   cp .env.example .env
   ```

   Edit and add your API key.

5. **Run the backend**
   ```bash
   python main.py
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```

## Data File Formats

### malpractice_cases.csv

```csv
Case Name,Year,Specialty,Facts,Verdict,Key Error,Settlement
Johnson v. Memorial Hospital,2019,Emergency,"55M presented to ED with chest pain. Doctor gave aspirin, sent home without ECG. Patient died of MI 2 hours later.",Plaintiff,Failed to order ECG and rule out MI,$2.3M
Smith v. County Hospital,2018,Emergency,"8yo with fever and headache. Diagnosed as viral illness. No lumbar puncture. Returned next day with meningitis.",Plaintiff,Failed to perform LP despite concerning symptoms,$1.8M
```

### clinical_standards.json

```json
{
  "chest_pain": {
    "required_workup": [
      "12-lead ECG within 10 minutes",
      "Cardiac troponin (0 and 3 hours)",
      "Vital signs including oxygen saturation",
      "Chest X-ray"
    ],
    "red_flags": [
      "Radiation to arm/jaw/back",
      "Diaphoresis",
      "Syncope",
      "Shortness of breath"
    ],
    "must_rule_out": [
      "Myocardial infarction (MI)",
      "Pulmonary embolism (PE)",
      "Aortic dissection"
    ],
    "risk_scores": {
      "name": "HEART score",
      "low_risk_threshold": "<4"
    },
    "documentation_requirements": [
      "Document HEART score calculation",
      "Document shared decision making"
    ]
  }
}
```

## API Endpoints

- `POST /api/v1/analyze` - Analyze a medical case
- `GET /api/v1/health` - Health check
- `GET /api/v1/stats` - Database statistics

## Tech Stack

### Backend
- **Framework**: FastAPI
- **AI/ML**: Anthropic Claude, LangGraph, LangChain
- **Vector DB**: ChromaDB
- **Data**: Pandas

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload in development mode
2. **API Documentation**: Visit `/docs` for interactive API documentation
3. **Type Safety**: Frontend uses TypeScript for type safety
4. **CORS**: Configured for local development (localhost:3000 ↔ localhost:8000)

## Troubleshooting

**ChromaDB Issues**: Delete `data/chroma_db/` and restart

**CORS Errors**: Check that backend CORS_ORIGINS includes your frontend URL

**API Connection**: Ensure backend is running on port 8000

**Build Errors**: Delete `node_modules` and reinstall: `npm install`
