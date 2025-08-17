# Python Generator Service

A FastAPI-based AI content generation service that provides text and image generation capabilities using Google Gemini and Stable Diffusion APIs.

## Features

- **Text Generation**: Generate text content using Google Gemini API
- **Image Generation**: Generate images using Stable Diffusion via ModelsLab API
- **Webhook Support**: Asynchronous image generation with webhook callbacks
- **Error Handling**: Comprehensive error handling and status management
- **CORS Support**: Cross-origin resource sharing enabled for frontend integration

## Prerequisites

- Python 3.8 or higher
- pip package manager
- API keys for:
  - Google Gemini API
  - ModelsLab Stable Diffusion API

## Installation

### Local Development

```bash
# Clone the repository (if not already done)
# cd python-generator

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Docker Installation

```bash
# Build Docker image
docker build -t python-generator .

# Run container
docker run -p 8000:8000 --env-file .env python-generator
```

## Configuration

Create a `.env` file in the project root with the following variables:

```env
# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
STABLE_DIFFUSION_KEY=your_stable_diffusion_key_here

# API URLs
MODELSLAB_API_URL=https://api.modelslab.com/v1/stable-diffusion/text2img

# Webhook Configuration
WEBHOOK_BASE_URL=http://localhost:3000
```

## Running the Service

### Development Mode

```bash
# Start the development server
python app.py

# Or using uvicorn directly
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Production Mode

```bash
# Using uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000

# Using Docker
docker run -p 8000:8000 --env-file .env python-generator
```

The service will be available at `http://localhost:8000`

## API Endpoints

### Health Check
- **GET** `/health` - Service health status

### Text Generation
- **POST** `/generate-text` - Generate text using Gemini API
  - Request body: `{"prompt": "Your text prompt here"}`
  - Response: `{"success": true, "text": "Generated text content"}`

### Image Generation
- **POST** `/generate-image` - Generate image using Stable Diffusion
  - Request body: `{"prompt": "Your image prompt", "track_id": "unique_id"}`
  - Response: `{"success": true, "imageUrl": "generated_image_url", "error": null}`

## Testing

### Manual Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test text generation
curl -X POST http://localhost:8000/generate-text \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a short story about a robot"}'

# Test image generation
curl -X POST http://localhost:8000/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A beautiful sunset over mountains", "track_id": "test123"}'
```

### Automated Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run tests with coverage
pytest --cov=app --cov-report=html
```

### API Documentation

Once the service is running, you can access:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Project Structure

```
python-generator/
├── app.py                 # Main FastAPI application
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
├── .env                  # Environment variables (create this)
├── constants/            # Configuration constants
│   ├── api_config.py     # API configuration
│   ├── error_config.py   # Error handling configuration
│   ├── exception_config.py # Exception definitions
│   └── status_config.py  # Status configuration
└── schemas/              # Pydantic models
    ├── models.py         # Request/response models
    ├── status.py         # Status enums
    ├── exceptions.py     # Exception types
    └── status_props.py   # Status properties
```

## Error Handling

The service includes comprehensive error handling for:
- API key configuration issues
- Network timeouts
- Request failures
- Unexpected errors

Each error type has specific configuration and appropriate HTTP status codes.

## Webhook Integration

The image generation endpoint supports webhook callbacks:
- Set `WEBHOOK_BASE_URL` in environment variables
- Include `track_id` in requests for tracking
- Webhooks are sent to `{WEBHOOK_BASE_URL}/webhook` with generation results

## Performance Considerations

- Text generation is synchronous and typically responds within seconds
- Image generation is asynchronous with webhook callbacks
- Request timeouts are set to 60 seconds for image generation
- CORS is configured for frontend integration

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure all required API keys are set in `.env`
2. **CORS Issues**: Check CORS configuration for your frontend URL
3. **Webhook Failures**: Verify `WEBHOOK_BASE_URL` is accessible
4. **Timeout Errors**: Increase timeout values for slow image generation

### Logs

Enable debug logging by setting the log level:
```bash
export LOG_LEVEL=DEBUG
```

## Development

### Adding New Features

1. Create new endpoints in `app.py`
2. Add corresponding Pydantic models in `schemas/`
3. Update configuration in `constants/` if needed
4. Add tests for new functionality

### Code Style

The project follows PEP 8 guidelines. Use a linter like `flake8`:
```bash
pip install flake8
flake8 .
```

## Deployment

### Docker Deployment

```bash
# Build production image
docker build -t python-generator:latest .

# Run with environment variables
docker run -d \
  -p 8000:8000 \
  --env-file .env \
  --name python-generator \
  python-generator:latest
```

### Environment Variables

Required environment variables for production:
- `GEMINI_API_KEY`
- `STABLE_DIFFUSION_KEY`
- `MODELSLAB_API_URL`
- `WEBHOOK_BASE_URL`

## Contributing

1. Follow PEP 8 coding standards
2. Add tests for new features
3. Update documentation
4. Use conventional commit messages

## License

This project is part of the fullstack challenge application.
