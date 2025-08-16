import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';
import { IColumn } from '../../../shared/interfaces/column.interface';
import { FieldEnum } from '../../../shared/interfaces/field.enum';
import { StatusEnum } from '../../../shared/interfaces/status.enum';
import { CampaignsModel } from '../../models/campaigns.model';
import { LoadCampaignPagination, LoadCampaigns, SetSort } from '../../state/campaigns.actions';
import { selectCampaignsTableModel } from '../../state/campaigns.selectors';
import { Campaign } from '../../types/campaign.interface';
import { CAMPAIGN_PROPERTY_TO_FIELD, CAMPAIGN_TABLE_COLUMNS, STATUS_CONTENT_CONFIG, STATUS_TO_COLOR } from './campaign-table.component.config';

@Component({
  selector: 'app-campaigns-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    ImagePreviewComponent
  ],
  templateUrl: './campaigns-table.component.html',
  styleUrl: './campaigns-table.component.scss'
})
export class CampaignsTableComponent implements OnInit {
  readonly model$: Observable<CampaignsModel> = this.store.select(selectCampaignsTableModel);

  readonly columns: IColumn[] = CAMPAIGN_TABLE_COLUMNS;
  readonly displayedColumns: string[] = this.columns.map(col => col.field);
  FieldEnum = FieldEnum;
  StatusEnum = StatusEnum;
  // TODO: Fix error in html
  readonly statusToColor: any = STATUS_TO_COLOR;
  readonly statusContentConfig: any = STATUS_CONTENT_CONFIG;

  // Sorting state
  readonly currentSort$: Observable<Sort> = this.model$.pipe(map(model => ({ active: CAMPAIGN_PROPERTY_TO_FIELD[model.sort.property] ?? FieldEnum.CREATED_AT, direction: model.sort.direction })));

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadCampaigns());
  }

  onPageChange(event: PageEvent, currentSort: Sort): void {
    const page = event.pageIndex + 1; // Material paginator is 0-based, API is 1-based
    const limit = event.pageSize;
    this.store.dispatch(new LoadCampaignPagination({ page, limit, sortBy: currentSort.active, direction: currentSort.direction }));
  }

  onSortChange(sort: Sort): void {
    this.store.dispatch(new SetSort({ property: sort.active as keyof Campaign, direction: sort.direction || 'desc' }));
    const sortBy = sort.active;
    const direction = sort.direction || 'desc';

    // Dispatch action to reload campaigns with new sorting
    this.store.dispatch(new LoadCampaignPagination({
      page: 1,
      limit: 10,
      sortBy,
      direction
    }));
  }
}
