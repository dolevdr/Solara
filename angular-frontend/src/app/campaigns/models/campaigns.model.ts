import { Campaign, Pagination, SortState } from '../types/campaign.interface';

export interface CampaignsModel {
    campaigns: Campaign[];
    loading: boolean;
    error: string | null;
    pagination: Pagination | null;
    sort: SortState;
}
