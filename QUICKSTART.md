# SupoClip Quick Start Guide

Run SupoClip with Docker in just one command!

## Prerequisites

1. **Docker Desktop** installed and running
2. **API Keys** (get these from the providers):
   - [AssemblyAI API Key](https://www.assemblyai.com/) (required for transcription)
   - At least one AI provider:
      - [OpenAI API Key](https://platform.openai.com/api-keys) (recommended)
      - [Google AI API Key](https://makersuite.google.com/app/apikey)
      - [Anthropic API Key](https://console.anthropic.com/)
      - [Ollama](https://ollama.com/) (local/self-hosted, no API key required for local)

## Quick Start

Set `USE_GPU=true` or `USE_GPU=false` in `.env`, then:

```bash
docker compose up -d --build
```

That's it! Docker will build images and start all services (frontend, backend, worker, Postgres, Redis).
CPU-only: `docker compose -f docker-compose.yml -f docker-compose.cpu.yml up -d --build`

## First Time Setup

### 1. Configure Environment Variables

Edit the `.env` file in the project root and add your API keys:

```bash
# Required for video transcription
ASSEMBLY_AI_API_KEY=your_assemblyai_key_here

# Choose one AI provider for clip selection
OPENAI_API_KEY=your_openai_key_here

# Configure which AI model to use
LLM=openai:gpt-4

# OR use Ollama locally
# LLM=ollama:gpt-oss:20b
# OLLAMA_BASE_URL=http://localhost:11434/v1
```

### 2. Start SupoClip

```bash
docker compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Docker Commands

```bash
# Start (reads USE_GPU from .env)
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down

# CPU-only (no nvidia-container-toolkit)
docker compose -f docker-compose.yml -f docker-compose.cpu.yml up -d --build
```

## Environment Configuration

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `ASSEMBLY_AI_API_KEY` | Speech-to-text transcription | https://www.assemblyai.com/ |
| `LLM` | AI model identifier | e.g., `openai:gpt-5.2` or `ollama:gpt-oss:20b` |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WHISPER_MODEL_SIZE` | `medium` | Whisper model size (tiny/base/small/medium/large) |
| `BETTER_AUTH_SECRET` | dev secret | Auth secret (change in production!) |
| `GOOGLE_API_KEY` | - | For Google Gemini models |
| `ANTHROPIC_API_KEY` | - | For Claude models |
| `OLLAMA_BASE_URL` | `http://localhost:11434/v1` | For local/self-hosted Ollama endpoint |
| `OLLAMA_API_KEY` | - | Optional, required for Ollama Cloud |

## Supported AI Models

### OpenAI (Recommended)
```bash
LLM=openai:gpt-4
LLM=openai:gpt-4-turbo
LLM=openai:gpt-3.5-turbo
```

### Anthropic
```bash
LLM=anthropic:claude-3-5-sonnet-20241022
LLM=anthropic:claude-3-opus
LLM=anthropic:claude-3-haiku
```

### Google
```bash
LLM=google-gla:gemini-3-flash-preview
LLM=google-gla:gemini-3-pro-preview
```

### Ollama
```bash
LLM=ollama:gpt-oss:20b
OLLAMA_BASE_URL=http://localhost:11434/v1
```

## Troubleshooting

### Services not starting?

1. **Check Docker is running**:
   ```bash
   docker info
   ```

2. **View service logs**:
   ```bash
   docker-compose logs -f
   ```

3. **Check service health**:
   ```bash
   docker-compose ps
   ```

### API Keys not working?

1. Verify keys are set in `.env` file
2. Ensure no extra spaces around the `=` sign
3. Restart services after changing `.env`:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Database issues?

Reset the database:
```bash
docker compose down -v  # WARNING: This deletes all data!
docker compose up -d --build
```

## Architecture

SupoClip runs 5 Docker containers:

1. **Frontend** (Next.js 15) - Port 3000
2. **Backend** (FastAPI + Python) - Port 8000
3. **Worker** (ARQ video processing) - no exposed port
4. **PostgreSQL** - Port 5432
5. **Redis** - Port 6379

All services are connected via a Docker network and start automatically with proper health checks.

## What Happens When You Run `docker compose up -d --build`?

1. Builds Docker images (first time: ~5-10 minutes)
2. Starts PostgreSQL and waits for it to be healthy
3. Starts Redis cache
4. Starts backend API server
5. Starts worker for video processing
6. Starts frontend web server
7. All services are available at the URLs above

## Production Deployment

For production use:

1. Change `BETTER_AUTH_SECRET` to a secure random string
2. Use strong database passwords
3. Enable HTTPS with a reverse proxy (nginx/Caddy)
4. Set up persistent volumes for data
5. Configure backup strategies

## Next Steps

- Read the full documentation in `CLAUDE.md`
- Check out the API docs at http://localhost:8000/docs
- View example clips in the frontend
- Customize fonts by adding TTF files to `backend/fonts/`
- Add transition effects by adding MP4 files to `backend/transitions/`

## Getting Help

- Check logs: `docker compose logs -f`
- View API documentation: http://localhost:8000/docs
- Report issues: Create a GitHub issue with logs and error messages
