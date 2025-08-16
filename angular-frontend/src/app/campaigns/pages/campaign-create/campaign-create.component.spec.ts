import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { CreateCampaign } from '../../state/campaigns.actions';
import { CampaignType } from '../../types/campaign.interface';
import { CampaignCreateComponent } from './campaign-create.component';

describe('CampaignCreateComponent', () => {
  let component: CampaignCreateComponent;
  let fixture: ComponentFixture<CampaignCreateComponent>;
  let store: Store;
  let dispatchSpy: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignCreateComponent, BrowserAnimationsModule],
      providers: [
        provideMockStore({
          initialState: {}
        }),
        provideRouter([])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CampaignCreateComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create and initialize form with required fields', () => {
    expect(component).toBeTruthy();
    expect(component.campaignForm).toBeDefined();
    expect(component.nameControl).toBeDefined();
    expect(component.typeControl).toBeDefined();
    expect(component.promptControl).toBeDefined();
  });

  it('should dispatch CreateCampaign action when form is submitted with valid data', () => {
    // Arrange
    const mockCampaign = {
      name: 'Test Campaign',
      type: CampaignType.TEXT,
      prompt: 'Test prompt'
    };

    // Act
    component.campaignForm.patchValue(mockCampaign);
    component.onSubmit();

    // Assert
    expect(dispatchSpy).toHaveBeenCalledWith(
      new CreateCampaign({ campaign: mockCampaign })
    );
  });

  it('should validate form fields with proper constraints', () => {
    // Test name validation
    component.nameControl?.setValue('');
    expect(component.nameControl?.hasError('required')).toBeTruthy();

    // Test type validation
    component.typeControl?.setValue('');
    expect(component.typeControl?.hasError('required')).toBeTruthy();

    // Test prompt validation
    component.promptControl?.setValue('');
    expect(component.promptControl?.hasError('required')).toBeTruthy();

    // Test prompt max length
    const longPrompt = 'a'.repeat(component.maxPromptLength + 1);
    component.promptControl?.setValue(longPrompt);
    expect(component.promptControl?.hasError('maxlength')).toBeTruthy();
  });
});
