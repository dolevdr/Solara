import { SortDirection } from '@angular/material/sort';
import { Action } from '@ngrx/store';
import { Campaign, Pagination } from '../types/campaign.interface';

export enum CampaignActionTypes {
    LOAD_CAMPAIGNS = '[Campaigns] Load Campaigns',
    LOAD_CAMPAIGNS_SUCCESS = '[Campaigns] Load Campaigns Success',
    LOAD_CAMPAIGNS_FAILURE = '[Campaigns] Load Campaigns Failure',

    LOAD_CAMPAIGN_PAGINATION = '[Campaigns] Load Campaign Pagination',

    LOAD_CAMPAIGN_BY_ID = '[Campaigns] Load Campaign By ID',
    LOAD_CAMPAIGN_BY_ID_SUCCESS = '[Campaigns] Load Campaign By ID Success',
    LOAD_CAMPAIGN_BY_ID_FAILURE = '[Campaigns] Load Campaign By ID Failure',

    CREATE_CAMPAIGN = '[Campaigns] Create Campaign',
    CREATE_CAMPAIGN_SUCCESS = '[Campaigns] Create Campaign Success',
    CREATE_CAMPAIGN_FAILURE = '[Campaigns] Create Campaign Failure',

    UPDATE_CAMPAIGN = '[Campaigns] Update Campaign',
    UPDATE_CAMPAIGN_SUCCESS = '[Campaigns] Update Campaign Success',
    UPDATE_CAMPAIGN_FAILURE = '[Campaigns] Update Campaign Failure',

    DELETE_CAMPAIGN = '[Campaigns] Delete Campaign',
    DELETE_CAMPAIGN_SUCCESS = '[Campaigns] Delete Campaign Success',
    DELETE_CAMPAIGN_FAILURE = '[Campaigns] Delete Campaign Failure',

    SELECT_CAMPAIGN = '[Campaigns] Select Campaign',

    SET_SORT = '[Campaigns] Set Sort',

    CLEAR_ERROR = '[Campaigns] Clear Error',
    RESET_STATE = '[Campaigns] Reset State'
}

// Load Campaigns
export class LoadCampaigns implements Action {
    readonly type = CampaignActionTypes.LOAD_CAMPAIGNS;
}

export class LoadCampaignsSuccess implements Action {
    readonly type = CampaignActionTypes.LOAD_CAMPAIGNS_SUCCESS;
    constructor(public payload: { campaigns: Campaign[]; pagination: Pagination | null }) { }
}

export class LoadCampaignsFailure implements Action {
    readonly type = CampaignActionTypes.LOAD_CAMPAIGNS_FAILURE;
    constructor(public payload: { error: string }) { }
}

// Load Campaign Pagination
export class LoadCampaignPagination implements Action {
    readonly type = CampaignActionTypes.LOAD_CAMPAIGN_PAGINATION;
    constructor(public payload: {
        page: number;
        limit: number;
        sortBy?: string;
        direction?: SortDirection;
    }) { }
}

// Load Campaign By ID
export class LoadCampaignById implements Action {
    readonly type = CampaignActionTypes.LOAD_CAMPAIGN_BY_ID;
    constructor(public payload: { id: string }) { }
}

export class LoadCampaignByIdSuccess implements Action {
    readonly type = CampaignActionTypes.LOAD_CAMPAIGN_BY_ID_SUCCESS;
    constructor(public payload: { campaign: Campaign }) { }
}

export class LoadCampaignByIdFailure implements Action {
    readonly type = CampaignActionTypes.LOAD_CAMPAIGN_BY_ID_FAILURE;
    constructor(public payload: { error: string }) { }
}

// Create Campaign
export class CreateCampaign implements Action {
    readonly type = CampaignActionTypes.CREATE_CAMPAIGN;
    constructor(public payload: { campaign: Partial<Campaign> }) { }
}

export class CreateCampaignSuccess implements Action {
    readonly type = CampaignActionTypes.CREATE_CAMPAIGN_SUCCESS;
    constructor(public payload: { campaign: Campaign; sortedCampaigns?: Campaign[] }) { }
}

export class CreateCampaignFailure implements Action {
    readonly type = CampaignActionTypes.CREATE_CAMPAIGN_FAILURE;
    constructor(public payload: { error: string }) { }
}

// Update Campaign
export class UpdateCampaign implements Action {
    readonly type = CampaignActionTypes.UPDATE_CAMPAIGN;
    constructor(public payload: { id: string; campaign: Partial<Campaign> }) { }
}

export class UpdateCampaignSuccess implements Action {
    readonly type = CampaignActionTypes.UPDATE_CAMPAIGN_SUCCESS;
    constructor(public payload: { campaign: Campaign }) { }
}

export class UpdateCampaignFailure implements Action {
    readonly type = CampaignActionTypes.UPDATE_CAMPAIGN_FAILURE;
    constructor(public payload: { error: string }) { }
}

// Delete Campaign
export class DeleteCampaign implements Action {
    readonly type = CampaignActionTypes.DELETE_CAMPAIGN;
    constructor(public payload: { id: string }) { }
}

export class DeleteCampaignSuccess implements Action {
    readonly type = CampaignActionTypes.DELETE_CAMPAIGN_SUCCESS;
    constructor(public payload: { id: string }) { }
}

export class DeleteCampaignFailure implements Action {
    readonly type = CampaignActionTypes.DELETE_CAMPAIGN_FAILURE;
    constructor(public payload: { error: string }) { }
}

// Select Campaign
export class SelectCampaign implements Action {
    readonly type = CampaignActionTypes.SELECT_CAMPAIGN;
    constructor(public payload: { id: string }) { }
}

// Set Sort
export class SetSort implements Action {
    readonly type = CampaignActionTypes.SET_SORT;
    constructor(public payload: { property: keyof Campaign; direction: SortDirection }) { }
}


// Clear Error
export class ClearCampaignsError implements Action {
    readonly type = CampaignActionTypes.CLEAR_ERROR;
}

// Reset State
export class ResetCampaignsState implements Action {
    readonly type = CampaignActionTypes.RESET_STATE;
}

export type CampaignActions =
    | LoadCampaigns
    | LoadCampaignsSuccess
    | LoadCampaignsFailure
    | LoadCampaignPagination
    | LoadCampaignById
    | LoadCampaignByIdSuccess
    | LoadCampaignByIdFailure
    | CreateCampaign
    | CreateCampaignSuccess
    | CreateCampaignFailure
    | UpdateCampaign
    | UpdateCampaignSuccess
    | UpdateCampaignFailure
    | DeleteCampaign
    | DeleteCampaignSuccess
    | DeleteCampaignFailure
    | SelectCampaign
    | SetSort
    | ClearCampaignsError
    | ResetCampaignsState;
