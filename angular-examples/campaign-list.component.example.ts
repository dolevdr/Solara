// Example Campaign List Component

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil, switchMap, startWith } from 'rxjs/operators';
import { CampaignService } from '../services/campaign.service';
import { Campaign, CampaignStatus } from '../models/campaign.model';

@Component({
  selector: 'app-campaign-list',
  template: `
    <div class="campaign-list-container">
      <div class="header">
        <h1>My Campaigns</h1>
        <button mat-raised-button color="primary" (click)="createCampaign()">
          <mat-icon>add</mat-icon>
          New Campaign
        </button>
      </div>

      <div class="filters" *ngIf="campaigns.length > 0">
        <mat-form-field appearance="outline">
          <mat-label>Filter by status</mat-label>
          <mat-select [(value)]="selectedStatus" (selectionChange)="onFilterChange()">
            <mat-option value="">All</mat-option>
            <mat-option value="pending">Pending</mat-option>
            <mat-option value="processing">Processing</mat-option>
            <mat-option value="completed">Completed</mat-option>
            <mat-option value="failed">Failed</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="loading-container" *ngIf="isLoading && campaigns.length === 0">
        <mat-spinner></mat-spinner>
        <p>Loading campaigns...</p>
      </div>

      <div class="empty-state" *ngIf="!isLoading && filteredCampaigns.length === 0">
        <mat-icon class="empty-icon">campaign</mat-icon>
        <h2>No campaigns found</h2>
        <p>Create your first campaign to get started with AI content generation.</p>
        <button mat-raised-button color="primary" (click)="createCampaign()">
          Create Campaign
        </button>
      </div>

      <div class="campaigns-grid" *ngIf="filteredCampaigns.length > 0">
        <mat-card 
          *ngFor="let campaign of filteredCampaigns; trackBy: trackByCampaignId" 
          class="campaign-card"
          [class.processing]="campaign.status === 'processing'"
          (click)="viewCampaign(campaign.id)">
          
          <mat-card-header>
            <div class="campaign-status">
              <mat-chip [color]="getStatusColor(campaign.status)" selected>
                <mat-icon>{{ getStatusIcon(campaign.status) }}</mat-icon>
                {{ campaign.status | titlecase }}
              </mat-chip>
            </div>
            <mat-card-title>{{ campaign.prompt | slice:0:50 }}{{ campaign.prompt.length > 50 ? '...' : '' }}</mat-card-title>
            <mat-card-subtitle>{{ campaign.createdAt | date:'medium' }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="campaign-preview" *ngIf="campaign.status === 'completed'">
              <div class="generated-text" *ngIf="campaign.generatedText">
                <p>{{ campaign.generatedText | slice:0:100 }}{{ campaign.generatedText.length > 100 ? '...' : '' }}</p>
              </div>
              <div class="generated-image" *ngIf="campaign.imageUrl">
                <img [src]="campaign.imageUrl" [alt]="campaign.prompt" loading="lazy">
              </div>
            </div>
            
            <div class="processing-indicator" *ngIf="campaign.status === 'processing'">
              <mat-progress-bar mode="indeterminate"></mat-progress-bar>
              <p>Generating content...</p>
            </div>

            <div class="error-message" *ngIf="campaign.status === 'failed'">
              <mat-icon color="warn">error</mat-icon>
              <p>{{ campaign.error || 'Generation failed' }}</p>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button (click)="viewCampaign(campaign.id); $event.stopPropagation()">
              <mat-icon>visibility</mat-icon>
              View Details
            </button>
            <button 
              mat-button 
              *ngIf="campaign.status === 'failed'"
              (click)="retryCampaign(campaign); $event.stopPropagation()">
              <mat-icon>refresh</mat-icon>
              Retry
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .campaign-list-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .filters {
      margin-bottom: 2rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem;
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
      margin-bottom: 1rem;
    }

    .campaigns-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .campaign-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .campaign-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .campaign-card.processing {
      border-left: 4px solid #2196f3;
    }

    .campaign-status {
      margin-bottom: 0.5rem;
    }

    .campaign-preview {
      margin: 1rem 0;
    }

    .generated-text {
      margin-bottom: 1rem;
      font-style: italic;
      color: #666;
    }

    .generated-image img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 4px;
    }

    .processing-indicator {
      margin: 1rem 0;
    }

    .processing-indicator p {
      margin-top: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f44336;
      margin: 1rem 0;
    }

    @media (max-width: 768px) {
      .campaign-list-container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .campaigns-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CampaignListComponent implements OnInit, OnDestroy {
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  selectedStatus: CampaignStatus | '' = '';
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private campaignService: CampaignService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCampaigns(): void {
    this.isLoading = true;
    this.campaignService.getCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load campaigns:', error);
        this.isLoading = false;
      }
    });
  }

  startAutoRefresh(): void {
    // Refresh every 30 seconds to get status updates
    interval(30000)
      .pipe(
        takeUntil(this.destroy$),
        startWith(0),
        switchMap(() => this.campaignService.getCampaigns())
      )
      .subscribe({
        next: (campaigns) => {
          this.campaigns = campaigns;
          this.applyFilters();
        },
        error: (error) => console.error('Auto-refresh failed:', error)
      });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCampaigns = this.selectedStatus
      ? this.campaigns.filter(c => c.status === this.selectedStatus)
      : this.campaigns;
  }

  createCampaign(): void {
    this.router.navigate(['/campaigns/create']);
  }

  viewCampaign(id: string): void {
    this.router.navigate(['/campaigns', id]);
  }

  retryCampaign(campaign: Campaign): void {
    // Implement retry logic
    console.log('Retrying campaign:', campaign.id);
  }

  trackByCampaignId(index: number, campaign: Campaign): string {
    return campaign.id;
  }

  getStatusColor(status: CampaignStatus): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'completed': return 'primary';
      case 'processing': return 'accent';
      case 'failed': return 'warn';
      default: return 'primary';
    }
  }

  getStatusIcon(status: CampaignStatus): string {
    switch (status) {
      case 'pending': return 'schedule';
      case 'processing': return 'autorenew';
      case 'completed': return 'check_circle';
      case 'failed': return 'error';
      default: return 'help';
    }
  }
}