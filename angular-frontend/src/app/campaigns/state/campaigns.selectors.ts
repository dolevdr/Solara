import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CampaignsModel } from '../models/campaigns.model';
import { CAMPAIGNS_FEATURE_KEY, CampaignsState, campaignsAdapter } from './campaigns.state';

export const selectCampaignsState = createFeatureSelector<CampaignsState>(CAMPAIGNS_FEATURE_KEY);

// Entity Adapter Selectors
export const {
    selectIds: selectCampaignIds,
    selectEntities: selectCampaignEntities,
    selectAll: selectAllCampaigns,
    selectTotal: selectTotalCampaigns,
} = campaignsAdapter.getSelectors(selectCampaignsState);

// Custom Selectors
export const selectCampaignsLoading = createSelector(
    selectCampaignsState,
    (state: CampaignsState) => state.loading
);

export const selectCampaignsError = createSelector(
    selectCampaignsState,
    (state: CampaignsState) => state.error
);

export const selectSelectedCampaignId = createSelector(
    selectCampaignsState,
    (state) => state.selectedCampaignId
);

export const selectSelectedCampaign = createSelector(
    selectCampaignEntities,
    selectSelectedCampaignId,
    (entities, selectedId) => selectedId ? entities[selectedId] : null
);

export const selectPagination = createSelector(
    selectCampaignsState,
    (state) => state.pagination
);

export const selectSort = createSelector(
    selectCampaignsState,
    (state) => state.sort
);

// Combined Selectors
export const selectCampaignsTableModel = createSelector(
    selectAllCampaigns,
    selectCampaignsLoading,
    selectCampaignsError,
    selectPagination,
    selectSort,
    (campaigns, loading, error, pagination, sort): CampaignsModel => ({
        campaigns,
        loading,
        error,
        pagination,
        sort
    })
);
