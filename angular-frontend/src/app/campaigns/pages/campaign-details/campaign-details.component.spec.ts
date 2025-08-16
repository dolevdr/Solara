import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { StatusEnum } from '../../../shared/interfaces/status.enum';
import { LoadCampaignById } from '../../state/campaigns.actions';
import { Campaign, CampaignType } from '../../types/campaign.interface';
import { CampaignDetailsComponent } from './campaign-details.component';

describe('CampaignDetailsComponent', () => {
  let component: CampaignDetailsComponent;
  let fixture: ComponentFixture<CampaignDetailsComponent>;
  let store: Store;
  let snackBar: MatSnackBar;
  let dispatchSpy: any;
  let snackBarSpy: any;

  const mockCampaign: Campaign = {
    id: '1',
    name: 'Test Campaign',
    prompt: 'Test prompt',
    type: CampaignType.TEXT,
    status: StatusEnum.COMPLETED,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    result: { content: 'Test result content' }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignDetailsComponent, BrowserAnimationsModule],
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [
            { selector: 'selectSelectedCampaign', value: mockCampaign }
          ]
        }),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CampaignDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    snackBar = TestBed.inject(MatSnackBar);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    snackBarSpy = jest.spyOn(snackBar, 'open');
    fixture.detectChanges();
  });

  it('should create and initialize with campaign data', () => {
    expect(component).toBeTruthy();
    expect(component.campaign$).toBeDefined();
    expect(component.StatusEnum).toBeDefined();
    expect(component.STATUS_TO_COLOR).toBeDefined();
    expect(component.STATUS_TO_ICON).toBeDefined();
  });

  it('should dispatch LoadCampaignById action on init', () => {
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      new LoadCampaignById({ id: '1' })
    );
  });

  it('should have copyToClipboard method that calls snackBar', () => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined)
      }
    });

    // Act
    component.copyToClipboard('Test text');

    // Assert
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test text');
  });

  it('should have downloadImage method defined', () => {
    expect(component.downloadImage).toBeDefined();
    expect(typeof component.downloadImage).toBe('function');
  });
});
