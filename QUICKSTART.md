# Quick Start Guide

Get the AI Malpractice Risk Scanner running in 3 minutes.

## Prerequisites

- Docker and Docker Compose
- (Optional) Anthropic API key for real AI analysis

## Start in 3 Steps

### 1. Clone and Enter Directory

```bash
cd AI-Malpractice-Risk-Scanner
```

### 2. Start All Services

```bash
docker-compose up -d
```

That's it! The system will:
- Build backend and frontend containers
- Start the API server on port 8000
- Start the web interface on port 5173

### 3. Open in Browser

Visit: **http://localhost:5173**

## Test the Mock API

No API key needed for testing:

```bash
curl -X POST http://localhost:8000/api/v1/analyze-mock \
  -H "Content-Type: application/json" \
  -d '{"case_description":"Patient with chest pain"}'
```

## Using Real AI Analysis

1. Get an Anthropic API key from https://console.anthropic.com/

2. Create `.env` file:
```bash
echo "ANTHROPIC_API_KEY=your_key_here" > .env
```

3. Restart services:
```bash
docker-compose restart
```

4. Use the `/api/v1/analyze` endpoint (instead of `/analyze-mock`)

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild everything
docker-compose up --build -d
```

## Troubleshooting

**Frontend not loading?**
- Check if port 5173 is available
- View logs: `docker-compose logs frontend`

**Backend errors?**
- Check if port 8000 is available
- View logs: `docker-compose logs backend`

**Need to reset everything?**
```bash
docker-compose down
docker-compose up --build -d
```

## Next Steps

- Read [README.md](README.md) for full documentation
- Explore API docs at http://localhost:8000/docs
- Check project structure in [README.md](README.md#project-structure)