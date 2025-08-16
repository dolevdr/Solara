import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { Action, ActionReducer, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { CampaignsEffects } from './campaigns/state/campaigns.effects';
import { campaignsReducer } from './campaigns/state/campaigns.reducers';
import { CAMPAIGNS_FEATURE_KEY, CampaignsState } from './campaigns/state/campaigns.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore({
      [CAMPAIGNS_FEATURE_KEY]: campaignsReducer as ActionReducer<CampaignsState, Action>
    }),
    provideEffects([CampaignsEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    })
  ],
};
