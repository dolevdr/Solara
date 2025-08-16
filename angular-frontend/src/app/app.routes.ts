import { Routes } from '@angular/router';
import { CampaignCreateComponent } from './campaigns/pages/campaign-create/campaign-create.component';
import { CampaignDashboardComponent } from './campaigns/pages/campaign-dashboard/campaign-dashboard.component';
import { CampaignDetailsComponent } from './campaigns/pages/campaign-details/campaign-details.component';
import { CampaignPageComponent } from './campaigns/pages/campaign-page/campaign-page.component';

export const routes: Routes = [
    { path: 'campaigns', component: CampaignPageComponent },
    { path: 'dashboard', component: CampaignDashboardComponent },
    { path: 'create', component: CampaignCreateComponent },
    { path: 'campaign/:id', component: CampaignDetailsComponent },
    { path: '**', redirectTo: 'campaigns' }
];
