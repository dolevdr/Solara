// Example Campaign Creation Component

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CampaignService } from '../services/campaign.service';
import { CreateCampaignRequest } from '../models/campaign.model';

@Component({
  selector: 'app-campaign-create',
  template: `
    <div class="campaign-create-container">
      <mat-card class="create-card">
        <mat-card-header>
          <mat-card-title>Create New Campaign</mat-card-title>
          <mat-card-subtitle>Generate AI content from your prompt</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="campaignForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>User ID</mat-label>
              <input matInput formControlName="userId" placeholder="Enter your user ID">
              <mat-error *ngIf="campaignForm.get('userId')?.hasError('required')">
                User ID is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Prompt</mat-label>
              <textarea 
                matInput 
                formControlName="prompt" 
                placeholder="Describe what you want to generate..."
                rows="4">
              </textarea>
              <mat-hint>Be specific and creative! Example: "A serene beach scene with a cat wearing sunglasses"</mat-hint>
              <mat-error *ngIf="campaignForm.get('prompt')?.hasError('required')">
                Prompt is required
              </mat-error>
              <mat-error *ngIf="campaignForm.get('prompt')?.hasError('minlength')">
                Prompt must be at least 10 characters long
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                [disabled]="campaignForm.invalid || isSubmitting">
                <mat-icon *ngIf="isSubmitting">hourglass_empty</mat-icon>
                <span>{{ isSubmitting ? 'Creating...' : 'Create Campaign' }}</span>
              </button>
              
              <button 
                mat-button 
                type="button" 
                (click)="onCancel()"
                [disabled]="isSubmitting">
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .campaign-create-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
      min-height: calc(100vh - 200px);
      align-items: flex-start;
    }

    .create-card {
      width: 100%;
      max-width: 600px;
      margin-top: 2rem;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .campaign-create-container {
        padding: 1rem;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class CampaignCreateComponent implements OnInit {
  campaignForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.campaignForm = this.fb.group({
      userId: ['', [Validators.required]],
      prompt: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Auto-fill user ID if available from auth service
    // this.campaignForm.patchValue({ userId: this.authService.getCurrentUserId() });
  }

  onSubmit(): void {
    if (this.campaignForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const request: CreateCampaignRequest = this.campaignForm.value;
      
      this.campaignService.createCampaign(request).subscribe({
        next: (campaign) => {
          this.snackBar.open('Campaign created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/campaigns', campaign.id]);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open(
            error.message || 'Failed to create campaign. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/campaigns']);
  }
}