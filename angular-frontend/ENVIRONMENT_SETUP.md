# Environment Setup & Docker Configuration

## Environment Configuration

The Angular application supports multiple environments for different deployment scenarios:

### Available Environments

1. **Local Development** (`environment.ts`)
   - API URL: `http://localhost:3000`
   - Debug: Enabled
   - Source Maps: Enabled

2. **Development** (`environment.development.ts`)
   - API URL: `http://localhost:3000`
   - Debug: Enabled
   - Log Level: Debug

3. **Production** (`environment.production.ts`)
   - API URL: `https://api.yourdomain.com`
   - Debug: Disabled
   - Log Level: Error

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `production` | Production mode flag | `false` |
| `apiUrl` | Backend API URL | `http://localhost:3000` |
| `apiTimeout` | API request timeout (ms) | `30000` |
| `version` | Application version | `1.0.0` |
| `enableDebug` | Enable debug features | `true` (dev), `false` (prod) |
| `logLevel` | Logging level | `debug` (dev), `error` (prod) |

## Docker Configuration

### Development Setup

```bash
# Start all services in development mode
docker-compose -f docker-compose.fullstack.yml up

# Start only the Angular frontend
docker-compose -f docker-compose.fullstack.yml up angular-frontend
```

### Production Setup

```bash
# Start all services including production Angular build
docker-compose -f docker-compose.fullstack.yml --profile production up

# Start only production Angular frontend
docker-compose -f docker-compose.fullstack.yml --profile production up angular-frontend-prod
```

### Docker Services

1. **angular-frontend** (Development)
   - Port: `4200`
   - Configuration: Development
   - Hot reload: Enabled
   - Volume mounting: Enabled

2. **angular-frontend-prod** (Production)
   - Port: `8080`
   - Configuration: Production
   - Nginx server
   - Optimized build

## Build Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build for development
npm run build:dev

# Build for production
npm run build:prod
```

### Docker Development
```bash
# Build and start development container
docker-compose -f docker-compose.fullstack.yml up angular-frontend

# Rebuild container
docker-compose -f docker-compose.fullstack.yml build angular-frontend
```

### Docker Production
```bash
# Build and start production container
docker-compose -f docker-compose.fullstack.yml --profile production up angular-frontend-prod

# Build production image
docker-compose -f docker-compose.fullstack.yml build angular-frontend-prod
```

## Network Configuration

All services are connected via the `app-network` bridge network:

- **PostgreSQL**: `postgres:5432`
- **NestJS API**: `nestjs-service:3000`
- **Python Generator**: `python-generator:8000`
- **Angular Frontend**: `angular-frontend:4200` (dev) / `angular-frontend-prod:80` (prod)

## Environment-Specific Features

### Development Environment
- Source maps enabled
- Debug logging
- Hot module replacement
- Detailed error messages
- Development tools enabled

### Production Environment
- Code minification
- Tree shaking
- Gzip compression
- Security headers
- Optimized caching
- Error logging only

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check if ports are in use
   netstat -tulpn | grep :4200
   netstat -tulpn | grep :8080
   ```

2. **Docker build issues**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Environment not loading**
   - Ensure correct configuration is specified in `angular.json`
   - Check file replacements are correct
   - Verify environment files exist

### Health Checks

- **Development**: `http://localhost:4200`
- **Production**: `http://localhost:8080/health`

## Security Considerations

### Production Environment
- HTTPS enforcement
- Security headers
- Content Security Policy
- XSS protection
- CSRF protection

### Development Environment
- CORS enabled for local development
- Debug information available
- Source maps for debugging
