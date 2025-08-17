# Angular Frontend

A modern Angular application for campaign management with a beautiful UI and comprehensive state management.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Angular CLI (`npm install -g @angular/cli`)

## Installation

```bash
# Install dependencies
npm install
```

## Development

### Start Development Server

```bash
# Start the development server
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Development with Docker

```bash
# Build and run development container
docker build -f Dockerfile.dev -t angular-frontend-dev .
docker run -p 4200:4200 -v $(pwd):/app angular-frontend-dev
```

## Building

### Production Build

```bash
# Build for production
npm run build
# or
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

### Docker Production Build

```bash
# Build production Docker image
docker build -f Dockerfile.prod -t angular-frontend-prod .
docker run -p 80:80 angular-frontend-prod
```

## Testing

### Unit Tests

```bash
# Run unit tests
npm test
# or
ng test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests

```bash
# Run e2e tests
npm run e2e
# or
ng e2e
```

### Test Configuration

The project uses Jest for unit testing. Configuration can be found in:
- `jest.config.js` - Jest configuration
- `setup-jest.ts` - Jest setup file

## Code Quality

### Linting

```bash
# Run ESLint
npm run lint
```

### Formatting

```bash
# Format code with Prettier
npm run format
```

## Project Structure

```
src/
├── app/
│   ├── campaigns/          # Campaign management features
│   │   ├── components/     # Reusable campaign components
│   │   ├── pages/         # Campaign page components
│   │   ├── state/         # NgRx state management
│   │   └── types/         # Campaign type definitions
│   └── shared/            # Shared components and services
│       ├── components/    # Reusable UI components
│       ├── interfaces/    # Shared interfaces and enums
│       ├── services/      # Shared services
│       └── state/         # Shared state management
├── assets/                # Static assets
└── environments/          # Environment configurations
```

## Key Features

- **Modern Angular**: Built with Angular 18+ and standalone components
- **State Management**: NgRx for predictable state management
- **Testing**: Comprehensive unit and e2e testing with Jest
- **Docker Support**: Development and production Docker configurations
- **Theme Support**: Dark/light theme toggle functionality
- **Responsive Design**: Mobile-first responsive design
- **Type Safety**: Full TypeScript support with strict typing

## Environment Configuration

The application supports different environments:

- `environment.ts` - Default environment
- `environment.development.ts` - Development environment
- `environment.production.ts` - Production environment

## API Integration

The frontend integrates with:
- NestJS Backend Service (campaign management)
- Python Generator Service (AI content generation)

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port with `ng serve --port 4201`
2. **Node modules issues**: Delete `node_modules` and `package-lock.json`, then run `npm install`
3. **Angular CLI issues**: Update Angular CLI with `npm install -g @angular/cli@latest`

### Performance Optimization

- Use Angular's built-in performance tools
- Enable production mode for testing
- Monitor bundle size with `ng build --stats-json`

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## Further Help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
