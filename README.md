# Mini Solara System PRO-Live (Fullstack Edition)

Welcome to Solara AI's senior fullstack engineering challenge. Your task is to build a complete system that generates real text and images from a prompt, featuring a modern Angular frontend, NestJS API layer, and Python AI services. Only minimal scaffolding is provided – you must implement all business logic and create an intuitive user experience yourself.

## System Overview
1. A user creates campaigns through an **Angular web interface**.
2. The frontend sends requests to the **NestJS API** which stores jobs in PostgreSQL.
3. NestJS forwards prompts to the **Python AI service** for processing.
4. The Python service calls **Google Gemini** for text and **Stable Diffusion** for images.
5. Results are returned to NestJS, stored in the database, and displayed in the frontend.
6. Users can view real-time status updates and browse their campaign history.

## Provided Boilerplate
- Minimal NestJS application in `nestjs-service/`
- Minimal Python service in `python-generator/`
- `docker-compose.yml` for running both services with PostgreSQL
- Example environment file `.env.example`
- Placeholder scripts under `scripts/`

**Note:** You need to create the Angular frontend from scratch as part of this challenge.

## Assignment Tasks

### Backend Requirements (NestJS + Python)
- Implement REST endpoints in NestJS to create campaigns and fetch their status
- Add CORS configuration to allow frontend requests
- Persist job data in PostgreSQL (`campaigns` table suggested)
- Connect to the Python service via HTTP with proper error handling and retries
- In the Python service, integrate Google Gemini and Stable Diffusion for real output
- Save generated images to the `output/` folder and serve them via static endpoints
- Include structured logs with job IDs throughout the workflow
- Add WebSocket support for real-time status updates (bonus)

### Frontend Requirements (Angular)
Create a modern, responsive Angular application with the following features:

#### Core Functionality
- **Campaign Creation Page**: Clean form to input prompts with validation
- **Campaign Dashboard**: Grid/list view of all campaigns with status indicators
- **Campaign Detail View**: Full-screen display of generated content with metadata
- **Real-time Updates**: Auto-refresh or WebSocket integration for live status updates

#### UX/UI Requirements
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Elegant loading animations and progress indicators
- **Error Handling**: User-friendly error messages and retry mechanisms
- **Modern Styling**: Use Angular Material or create custom CSS with a professional look
- **Accessibility**: Proper ARIA labels, keyboard navigation, and screen reader support

#### Technical Implementation
- **Routing**: Implement proper Angular routing with guards
- **State Management**: Use Angular services or NgRx for state management
- **HTTP Interceptors**: Handle authentication, loading states, and errors globally
- **Reactive Forms**: Implement form validation with proper error display
- **Image Optimization**: Lazy loading and proper image display for generated content
- **TypeScript**: Strong typing throughout the application

#### Bonus Features
- **Dark/Light Theme Toggle**: Implement theme switching
- **Campaign Search/Filter**: Allow users to search and filter campaigns
- **Export Functionality**: Download generated images or campaign data
- **Progressive Web App**: Add PWA capabilities for offline viewing
- **Animation**: Smooth transitions and micro-interactions

### Integration Requirements
- Ensure the Angular app communicates properly with the NestJS API
- Handle different campaign states (pending, processing, completed, failed) in the UI
- Display generated text and images in an appealing format
- Implement proper error boundaries and fallback UI components

## Setup Instructions

### Backend Setup
1. Copy the environment template and fill in your Gemini API key:
   ```bash
   cp .env.example .env
   ```
2. Start the backend services:
   ```bash
   docker-compose up --build
   ```

### Frontend Setup
3. Create and set up the Angular application:
   ```bash
   # Create new Angular app in the project root
   ng new angular-frontend --routing --style=scss
   cd angular-frontend
   
   # Install additional dependencies (suggestions)
   npm install @angular/material @angular/cdk @angular/animations
   npm install @angular/flex-layout
   ```

4. Configure the Angular app to proxy API requests to the NestJS backend

### Running the Full Stack
- Backend API: `http://localhost:3000`
- Frontend App: `http://localhost:4200` (default Angular dev server)
- Ensure CORS is properly configured in NestJS to allow frontend requests

## API Endpoints

### Core Endpoints
#### `POST /campaigns`
Enqueue a new campaign generation request.
```json
{
  "userId": "u123",
  "prompt": "Create a beach scene with a cat"
}
```

#### `GET /campaigns/:id`
Fetch the current status and generated results for a campaign.

#### `GET /campaigns`
List all campaigns for a user (implement pagination).

### Additional Endpoints (Required for Frontend)
#### `GET /campaigns/:id/image`
Serve the generated image file.

#### `GET /health`
Health check endpoint for monitoring.

### Optional WebSocket Events
#### `campaign-status-update`
Real-time status updates for active campaigns.

## Evaluation Criteria

### Backend (40%)
- **Functionality**: All API endpoints work correctly with proper error handling
- **Code Quality**: Clean, well-structured NestJS and Python code
- **Architecture**: Proper separation of concerns and service communication
- **Logging & Monitoring**: Comprehensive logging and error tracking

### Frontend (50%)
- **User Experience**: Intuitive, responsive, and visually appealing interface
- **Code Quality**: Well-organized Angular code with proper TypeScript usage
- **Functionality**: All features work smoothly with proper state management
- **Design**: Modern, professional UI that works across devices
- **Performance**: Optimized loading and rendering of content

### Integration (10%)
- **API Communication**: Seamless frontend-backend integration
- **Error Handling**: Graceful handling of network and server errors
- **Real-time Features**: Effective implementation of status updates

## Submission Guidelines
1. **Repository Structure**: Organize your code clearly with separate folders for frontend and backend
2. **Documentation**: Update this README with:
   - Setup instructions for your Angular app
   - Any additional dependencies or configuration
   - Screenshots or GIFs demonstrating the UI
   - Design decisions and trade-offs you made
3. **Demo**: Include a brief video or detailed screenshots showing the complete user flow
4. **Deployment**: Bonus points for Docker configuration that includes the frontend

### Submission Format
Share your completed project as a GitHub repository or zipped archive. Include:
- Complete source code for both backend and frontend
- Updated documentation
- Any additional configuration files
- Brief write-up of your approach and design decisions

**Time Expectation**: This is designed as a 4-6 hour challenge for an experienced fullstack developer.
