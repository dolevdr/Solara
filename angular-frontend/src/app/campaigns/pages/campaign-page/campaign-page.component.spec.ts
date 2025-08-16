import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CampaignPageComponent } from './campaign-page.component';

describe('CampaignPageComponent', () => {
  let component: CampaignPageComponent;
  let fixture: ComponentFixture<CampaignPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignPageComponent],
      providers: [
        provideMockStore({
          initialState: {}
        })
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CampaignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
