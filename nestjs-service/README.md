# NestJS Service

A robust NestJS backend service for campaign management with Prisma ORM, WebSocket support, and comprehensive API endpoints.

## Features

- **Campaign Management**: Full CRUD operations for campaigns
- **Database Integration**: Prisma ORM with PostgreSQL
- **Real-time Communication**: WebSocket support for live updates
- **API Documentation**: Swagger/OpenAPI documentation
- **Validation**: Request/response validation with class-validator
- **Error Handling**: Comprehensive error handling and logging
- **Testing**: Unit and e2e testing with Jest

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- PostgreSQL database
- Docker (optional, for containerized development)

## Installation

### Local Development

```bash
# Clone the repository (if not already done)
# cd nestjs-service

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API configurations

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database (optional)
npm run prisma:seed
```

### Docker Installation

```bash
# Build Docker image
docker build -t nestjs-service .

# Run with Docker Compose (recommended)
docker-compose up -d
```

## Configuration

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/campaign_db"

# Application
PORT=3000
NODE_ENV=development

# API Configuration
API_PREFIX=api
API_VERSION=v1

# WebSocket Configuration
WS_PORT=3001

# External Services
PYTHON_GENERATOR_URL=http://localhost:8000
```

## Running the Service

### Development Mode

```bash
# Start development server with hot reload
npm run start:dev

# Start with debug mode
npm run start:debug

# Start with specific debug port
npm run start:debug:port
```

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod

# Or using Docker
docker run -p 3000:3000 --env-file .env nestjs-service
```

The service will be available at `http://localhost:3000`

## Database Management

### Prisma Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Seed database
npm run prisma:seed
```

### Database Schema

The main entities include:
- **Campaigns**: Campaign management with various statuses
- **Results**: Campaign results and analytics
- **Webhooks**: Webhook management for external integrations

## API Endpoints

### Campaign Management
- **GET** `/api/v1/campaigns` - Get all campaigns
- **GET** `/api/v1/campaigns/:id` - Get campaign by ID
- **POST** `/api/v1/campaigns` - Create new campaign
- **PUT** `/api/v1/campaigns/:id` - Update campaign
- **DELETE** `/api/v1/campaigns/:id` - Delete campaign

### WebSocket Events
- **campaign:created** - New campaign created
- **campaign:updated** - Campaign updated
- **campaign:deleted** - Campaign deleted
- **campaign:status_changed** - Campaign status changed

## Testing

### Unit Tests

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run tests in debug mode
npm run test:debug
```

### End-to-End Tests

```bash
# Run e2e tests
npm run test:e2e
```

### Test Configuration

The project uses Jest for testing:
- Unit tests: `*.spec.ts` files
- E2E tests: `test/` directory
- Coverage reports: `coverage/` directory

## Code Quality

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

### TypeScript

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Build TypeScript
npm run build
```

## Project Structure

```
src/
├── app.module.ts          # Root application module
├── main.ts               # Application entry point
├── campaign/             # Campaign module
│   ├── campaign.controller.ts
│   ├── campaign.service.ts
│   ├── campaign.module.ts
│   ├── dto/              # Data Transfer Objects
│   └── rabbitmq.listener.ts
├── results/              # Results module
│   ├── results.service.ts
│   └── results.module.ts
├── ai/                   # AI integration module
│   ├── ai-proxy.service.ts
│   └── ai.module.ts
└── prisma/               # Database module
    ├── prisma.service.ts
    └── prisma.module.ts
```

## Key Features

- **Modular Architecture**: Clean separation of concerns with NestJS modules
- **Type Safety**: Full TypeScript support with strict typing
- **Database ORM**: Prisma for type-safe database operations
- **Real-time Updates**: WebSocket integration for live data
- **API Documentation**: Auto-generated Swagger documentation
- **Validation**: Request/response validation with DTOs
- **Testing**: Comprehensive test coverage with Jest

## WebSocket Integration

The service supports real-time communication:

```typescript
// Connect to WebSocket
const socket = io('http://localhost:3000');

// Listen for campaign events
socket.on('campaign:created', (campaign) => {
  console.log('New campaign created:', campaign);
});

socket.on('campaign:updated', (campaign) => {
  console.log('Campaign updated:', campaign);
});
```

## External Integrations

### Python Generator Service

The service integrates with the Python Generator for AI content:
- Text generation via `/generate-text` endpoint
- Image generation via `/generate-image` endpoint
- Webhook callbacks for asynchronous operations

### RabbitMQ Integration

For message queuing and async processing:
- Campaign status updates
- Webhook processing
- Background tasks

## Performance Optimization

- **Database Indexing**: Optimized Prisma queries
- **Caching**: Implement caching strategies where needed
- **Connection Pooling**: Database connection optimization
- **Compression**: Response compression for large payloads

## Troubleshooting

### Common Issues

1. **Database Connection**: Check `DATABASE_URL` in `.env`
2. **Prisma Client**: Run `npm run prisma:generate` after schema changes
3. **Port Conflicts**: Change port in `.env` or use different port
4. **Migration Issues**: Reset database with `npx prisma migrate reset`

### Logs

Enable debug logging:
```bash
export NODE_ENV=development
export LOG_LEVEL=debug
```

## Development

### Adding New Features

1. Create new modules in `src/`
2. Add controllers, services, and DTOs
3. Update Prisma schema if needed
4. Add tests for new functionality
5. Update API documentation

### Code Style

The project follows NestJS conventions:
- Use decorators for metadata
- Follow dependency injection patterns
- Use DTOs for validation
- Implement proper error handling

## Deployment

### Docker Deployment

```bash
# Build production image
docker build -t nestjs-service:latest .

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name nestjs-service \
  nestjs-service:latest
```

### Environment Variables

Required for production:
- `DATABASE_URL`
- `NODE_ENV=production`
- `PORT`
- External service URLs

## Monitoring and Health Checks

- **Health Endpoint**: `/health` for service status
- **Metrics**: Application metrics and performance monitoring
- **Logging**: Structured logging with different levels

## Contributing

1. Follow NestJS conventions and patterns
2. Write tests for new features
3. Update documentation and API specs
4. Use conventional commit messages
5. Ensure proper error handling

## API Documentation

Once the service is running, access:
- **Swagger UI**: `http://localhost:3000/api`
- **OpenAPI JSON**: `http://localhost:3000/api-json`

## License

This project is part of the fullstack challenge application.
