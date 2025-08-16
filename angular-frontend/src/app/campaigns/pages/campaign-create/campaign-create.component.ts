import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateCampaign } from '../../state/campaigns.actions';
import { selectCampaignsLoading } from '../../state/campaigns.selectors';
import { campaignTypes, maxPromptLength } from './campaign-create.config';

@Component({
  selector: 'app-campaign-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './campaign-create.component.html',
  styleUrl: './campaign-create.component.scss'
})
export class CampaignCreateComponent implements OnInit {
  campaignForm!: FormGroup;
  readonly campaignTypes = campaignTypes;
  readonly maxPromptLength = maxPromptLength;
  readonly loading$: Observable<boolean> = this.store.select(selectCampaignsLoading);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.campaignForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      prompt: new FormControl('', [Validators.required, Validators.maxLength(this.maxPromptLength)])
    });
  }


  onSubmit(): void {
    const formValue = this.campaignForm.value;
    this.store.dispatch(new CreateCampaign({ campaign: formValue }));
  }

  backToCampaigns(): void {
    this.router.navigate(['/campaigns']);
  }


  // Form control getters
  get nameControl() {
    return this.campaignForm.get('name');
  }

  get typeControl() {
    return this.campaignForm.get('type');
  }

  get promptControl() {
    return this.campaignForm.get('prompt');
  }
}
