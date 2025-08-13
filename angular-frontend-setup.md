# Angular Frontend Setup Guide

This guide helps you set up the Angular frontend for the Mini Solara System.

## Quick Start

1. **Create the Angular Application**
   ```bash
   # From the candidate/ directory
   ng new angular-frontend --routing --style=scss --skip-git
   cd angular-frontend
   ```

2. **Install Recommended Dependencies**
   ```bash
   # UI Components
   npm install @angular/material @angular/cdk @angular/animations
   
   # Layout and Utilities
   npm install @angular/flex-layout
   
   # Optional: State Management
   npm install @ngrx/store @ngrx/effects @ngrx/store-devtools
   ```

3. **Configure Proxy for API Calls**
   Create `proxy.conf.json`:
   ```json
   {
     "/api/*": {
       "target": "http://localhost:3000",
       "secure": false,
       "changeOrigin": true,
       "logLevel": "debug"
     }
   }
   ```

   Update `angular.json` serve configuration:
   ```json
   "serve": {
     "builder": "@angular-devkit/build-angular:dev-server",
     "options": {
       "proxyConfig": "proxy.conf.json"
     }
   }
   ```

4. **Start Development Server**
   ```bash
   ng serve
   ```

## Suggested Project Structure

```
angular-frontend/
├── src/
│   ├── app/
│   │   ├── core/                 # Singleton services, guards
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts
│   │   │   │   └── campaign.service.ts
│   │   │   └── interceptors/
│   │   │       └── http-error.interceptor.ts
│   │   ├── shared/               # Shared components, pipes, directives
│   │   │   ├── components/
│   │   │   │   ├── loading-spinner/
│   │   │   │   └── error-message/
│   │   │   └── models/
│   │   │       └── campaign.model.ts
│   │   ├── features/             # Feature modules
│   │   │   ├── campaign-create/
│   │   │   ├── campaign-list/
│   │   │   └── campaign-detail/
│   │   ├── layout/               # Layout components
│   │   │   ├── header/
│   │   │   └── sidebar/
│   │   └── app-routing.module.ts
│   ├── assets/
│   └── styles/
│       ├── _variables.scss
│       ├── _mixins.scss
│       └── styles.scss
```

## Key Implementation Tips

### 1. Campaign Model
```typescript
export interface Campaign {
  id: string;
  userId: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedText?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  error?: string;
}
```

### 2. API Service
```typescript
@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private apiUrl = '/api/campaigns';

  constructor(private http: HttpClient) {}

  createCampaign(campaign: Partial<Campaign>): Observable<Campaign> {
    return this.http.post<Campaign>(this.apiUrl, campaign);
  }

  getCampaign(id: string): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.apiUrl}/${id}`);
  }

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(this.apiUrl);
  }
}
```

### 3. Responsive Design Breakpoints
```scss
// _variables.scss
$breakpoints: (
  mobile: 480px,
  tablet: 768px,
  desktop: 1024px,
  large: 1200px
);

@mixin respond-to($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}
```

### 4. Material Theme Setup
```typescript
// app.module.ts
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
```

## Required Features Checklist

### Core Functionality
- [ ] Campaign creation form with validation
- [ ] Campaign list with status indicators
- [ ] Campaign detail view
- [ ] Real-time status updates
- [ ] Image display and optimization

### UX/UI Requirements
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states and progress indicators
- [ ] Error handling and user feedback
- [ ] Accessibility features
- [ ] Modern, professional styling

### Technical Implementation
- [ ] Proper routing with guards
- [ ] HTTP interceptors for error handling
- [ ] Reactive forms with validation
- [ ] TypeScript interfaces and strong typing
- [ ] Component lifecycle management

## Performance Considerations

1. **Lazy Loading**: Implement lazy loading for feature modules
2. **OnPush Strategy**: Use OnPush change detection for better performance
3. **TrackBy Functions**: Use trackBy in *ngFor for large lists
4. **Image Optimization**: Implement lazy loading for generated images
5. **Caching**: Cache API responses where appropriate

## Testing Recommendations

1. **Unit Tests**: Test components, services, and pipes
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user workflows
4. **Accessibility Tests**: Ensure WCAG compliance

## Deployment Notes

For production deployment, consider:
- Building with `ng build --prod`
- Serving static files through a web server
- Configuring environment-specific API URLs
- Implementing proper error logging
- Adding PWA capabilities for offline support