import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, switchMap } from 'rxjs';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';
import { StatusEnum } from '../../../shared/interfaces/status.enum';
import { STATUS_TO_COLOR } from '../../components/campaigns-table/campaign-table.component.config';
import { LoadCampaignById } from '../../state/campaigns.actions';
import { selectSelectedCampaign } from '../../state/campaigns.selectors';
import { Campaign } from '../../types/campaign.interface';
import { STATUS_TO_ICON } from './campaign-details.component.config';

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSnackBarModule,
    ImagePreviewComponent
  ],
  templateUrl: './campaign-details.component.html',
  styleUrl: './campaign-details.component.scss'
})
export class CampaignDetailsComponent implements OnInit {
  campaign$!: Observable<Campaign | null>;
  readonly StatusEnum = StatusEnum;
  readonly STATUS_TO_COLOR = STATUS_TO_COLOR;
  readonly STATUS_TO_ICON = STATUS_TO_ICON;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Initialize campaign$ observable and load campaign by ID
    this.campaign$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => {
        // Dispatch action to load campaign by ID
        this.store.dispatch(new LoadCampaignById({ id }));
        return this.store.select(selectSelectedCampaign).pipe(
          map(campaign => campaign || null)
        );
      })
    );
  }

  onBackToCampaigns(): void {
    this.router.navigate(['/campaigns']);
  }

  downloadImage(imageUrl: string, campaignName: string): void {
    // Show loading snackbar
    const loadingSnackBar = this.snackBar.open('Downloading image...', '', {
      duration: 0,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });

    // Fetch the image as a blob
    fetch(imageUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        // Create a blob URL
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${campaignName}-generated-image.png`;

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl);

        // Close loading and show success
        loadingSnackBar.dismiss();
        this.snackBar.open('Image downloaded successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      })
      .catch(error => {
        console.error('Download failed:', error);

        // Close loading and show error
        loadingSnackBar.dismiss();
        this.snackBar.open('Failed to download image', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Text copied to clipboard!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      this.snackBar.open('Failed to copy text', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    });
  }
}
