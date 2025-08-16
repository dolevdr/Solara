import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Campaign, Pagination, SortState } from '../types/campaign.interface';

export const CAMPAIGNS_FEATURE_KEY = 'campaigns';

export interface CampaignsState extends EntityState<Campaign> {
    loading: boolean;
    error: string | null;
    selectedCampaignId: string | null;
    pagination: Pagination | null;
    sort: SortState;
}

export const campaignsAdapter: EntityAdapter<Campaign> = createEntityAdapter<Campaign>({
    selectId: (campaign: Campaign) => campaign.id
});

export const CAMPAIGN_INITIAL_STATE: CampaignsState = campaignsAdapter.getInitialState({
    loading: false,
    error: null,
    selectedCampaignId: null,
    pagination: null,
    sort: {
        property: 'createdAt',
        direction: 'desc'
    }
});
