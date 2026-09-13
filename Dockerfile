# Dockerfile for the ML service.
# Build from the ml-service/ directory: docker build -t mi-ml-service .

FROM python:3.11-slim

WORKDIR /app

# Install dependencies first so this layer is cached when only code changes.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and models. The `models/` folder must be populated
# with the four .pkl files before building (or mounted as a volume at
# runtime — see docker-compose.yml at the project root).
COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
