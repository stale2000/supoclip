# Single Dockerfile for GPU and CPU: jrottenberg/ffmpeg has both NVENC and libx264
FROM jrottenberg/ffmpeg:8-nvidia

RUN apt-get update && apt-get install -y \
    python3 \
    python3-venv \
    python3-pip \
    curl \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python3 /usr/bin/python

RUN python3 -m pip install --no-cache-dir --break-system-packages uv

WORKDIR /app

COPY pyproject.toml uv.lock* ./
RUN uv venv .venv && uv sync

RUN uv pip install --upgrade --force-reinstall yt-dlp
RUN uv pip install --upgrade --force-reinstall "yt-dlp[default]"

COPY src/ ./src/
COPY fonts/ ./fonts/
COPY transitions/ ./transitions/

RUN mkdir -p /app/uploads /app/clips /app/logs /tmp

EXPOSE 8000

ENTRYPOINT []
CMD [".venv/bin/uvicorn", "src.main_refactored:app", "--host", "0.0.0.0", "--port", "8000"]
