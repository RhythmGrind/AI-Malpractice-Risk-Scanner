# Quick Start

This guide will get the AI Malpractice Risk Scanner running on your local machine.

## 1. Prerequisites

- Python 3.9+
- An Anthropic API key (for full functionality)

## 2. Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/AI-Malpractice-Risk-Scanner.git
    cd AI-Malpractice-Risk-Scanner
    ```

2.  **Configure Environment Variables:**
    -   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    -   Edit the `.env` file and add your Anthropic API key:
        ```
        ANTHROPIC_API_KEY="your-api-key-here"
        ```

3.  **Install Dependencies:**
    -   It's recommended to use a virtual environment.
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
    -   Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

## 3. Running the Application

The application consists of two main components: the Streamlit frontend and the FastAPI backend.

### Step 1: Start the Backend Server

In a terminal, navigate to the `backend` directory and run:

```bash
cd backend

# To load clinical standards into the vector database (only needs to be done once)
python -m app.services.vector_db

# Start the backend server
uvicorn main:app --host 0.0.0.0 --port 8000
```

The backend API will now be running at `http://127.0.0.1:8000`.

### Step 2: Start the Frontend UI

In a **new terminal**, from the project root directory, run:

```bash
streamlit run app.py
```

Or you can use the provided run scripts:
- On Windows: `run.bat`
- On macOS/Linux: `bash run.sh`

Your browser should open to the Streamlit application, ready for use.

## Test Mode

If you start the Streamlit frontend (`app.py`) without the backend server running, it will automatically launch in **Test Mode**. In this mode, the application uses mock data, allowing you to explore the UI without needing an API key or running the backend.