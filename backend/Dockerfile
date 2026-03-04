# Use jrottenberg ffmpeg image with NVENC for a single GPU/CPU Dockerfile.
# This base image includes ffmpeg with NVENC as well as libx264, so it works
# for both GPU (h264_nvenc) and CPU (libx264) encoding from the same image.
# We copy CUDA 12 runtime libs (e.g. libcublas.so.12) from the official image
# so faster-whisper/CTranslate2 can use the GPU; the jrottenberg image may
# ship a different CUDA version or minimal libs for ffmpeg only.
ARG CUDA_VERSION=12.6.0
FROM nvidia/cuda:${CUDA_VERSION}-runtime-ubuntu22.04 AS cuda-runtime
FROM jrottenberg/ffmpeg:8-nvidia
COPY --from=cuda-runtime /usr/local/cuda/lib64 /opt/cuda12/lib64
ENV LD_LIBRARY_PATH=/opt/cuda12/lib64:${LD_LIBRARY_PATH}

# Install system dependencies including Python and basic libs required by OpenCV/MoviePy.
RUN apt-get update && apt-get install -y \
    python3 \
    python3-venv \
    python3-pip \
    curl \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python3 /usr/bin/python

# Install uv package manager (using --break-system-packages is safe inside the container).
RUN python3 -m pip install --no-cache-dir --break-system-packages uv

# Set working directory
WORKDIR /app

# Copy pyproject.toml and uv.lock for dependency installation
COPY pyproject.toml uv.lock* ./

# Create virtual environment and install dependencies using uv sync
RUN uv venv .venv && uv sync

# Force update yt-dlp to the absolute latest version to handle YouTube API changes
# Also install from git/extras to get the very latest commits
RUN uv pip install --upgrade --force-reinstall yt-dlp
RUN uv pip install --upgrade --force-reinstall "yt-dlp[default]"

# Copy source code
COPY src/ ./src/

# Copy fonts and transitions directories
COPY fonts/ ./fonts/
COPY transitions/ ./transitions/

# Create necessary directories for video processing
RUN mkdir -p /app/uploads /app/clips /app/logs /tmp

# Expose the port FastAPI will run on
EXPOSE 8000

# jrottenberg image uses ffmpeg as ENTRYPOINT; clear it so uvicorn becomes the entrypoint
ENTRYPOINT []

# Activate virtual environment and start the application
CMD [".venv/bin/uvicorn", "src.main_refactored:app", "--host", "0.0.0.0", "--port", "8000"]
