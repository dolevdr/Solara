import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CampaignsTableComponent } from '../../components/campaigns-table/campaigns-table.component';

@Component({
  selector: 'app-campaign-page',
  standalone: true,
  imports: [CommonModule, CampaignsTableComponent],
  templateUrl: './campaign-page.component.html',
  styleUrl: './campaign-page.component.scss'
})
export class CampaignPageComponent {
}
