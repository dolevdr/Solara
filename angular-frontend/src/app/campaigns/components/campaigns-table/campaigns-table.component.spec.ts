import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StatusEnum } from '../../../shared/interfaces/status.enum';
import { CampaignsModel } from '../../models/campaigns.model';
import { LoadCampaignPagination, LoadCampaigns, SetSort } from '../../state/campaigns.actions';
import { selectCampaignsTableModel } from '../../state/campaigns.selectors';
import { CampaignType } from '../../types/campaign.interface';
import { CampaignsTableComponent } from './campaigns-table.component';

describe('CampaignsTableComponent', () => {
  let component: CampaignsTableComponent;
  let fixture: ComponentFixture<CampaignsTableComponent>;
  let store: MockStore;
  let dispatchSpy: any;

  const mockCampaignsModel: CampaignsModel = {
    campaigns: [
      {
        id: '1',
        name: 'Test Campaign',
        prompt: 'Test prompt',
        type: CampaignType.TEXT,
        status: StatusEnum.COMPLETED,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      pages: 1
    },
    sort: {
      property: 'createdAt',
      direction: 'desc'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CampaignsTableComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        BrowserAnimationsModule
      ],
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector: selectCampaignsTableModel,
              value: mockCampaignsModel
            }
          ]
        }),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignsTableComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore;
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create and dispatch LoadCampaigns on init', () => {
    expect(component).toBeTruthy();
    expect(dispatchSpy).toHaveBeenCalledWith(new LoadCampaigns());
  });

  it('should dispatch LoadCampaignPagination on page change', () => {
    const pageEvent = { pageIndex: 1, pageSize: 10, length: 20 };
    const currentSort = { active: 'createdAt', direction: 'desc' as const };

    component.onPageChange(pageEvent, currentSort);

    expect(dispatchSpy).toHaveBeenCalledWith(
      new LoadCampaignPagination({
        page: 2,
        limit: 10,
        sortBy: 'createdAt',
        direction: 'desc'
      })
    );
  });

  it('should dispatch SetSort and LoadCampaignPagination on sort change', () => {
    const sortEvent = { active: 'name', direction: 'asc' as const };

    component.onSortChange(sortEvent);

    expect(dispatchSpy).toHaveBeenCalledWith(
      new SetSort({ property: 'name', direction: 'asc' })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      new LoadCampaignPagination({
        page: 1,
        limit: 10,
        sortBy: 'name',
        direction: 'asc'
      })
    );
  });
});
