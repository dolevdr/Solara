import { CampaignActions, CampaignActionTypes } from './campaigns.actions';
import { CAMPAIGN_INITIAL_STATE, campaignsAdapter, CampaignsState } from './campaigns.state';

export function campaignsReducer(
    state: CampaignsState = CAMPAIGN_INITIAL_STATE,
    action: CampaignActions
): CampaignsState {
    switch (action.type) {
        case CampaignActionTypes.LOAD_CAMPAIGNS:
        case CampaignActionTypes.CREATE_CAMPAIGN:
        case CampaignActionTypes.UPDATE_CAMPAIGN:
        case CampaignActionTypes.DELETE_CAMPAIGN:
        case CampaignActionTypes.LOAD_CAMPAIGN_PAGINATION:
        case CampaignActionTypes.LOAD_CAMPAIGN_BY_ID:

            return {
                ...state,
                loading: true,
                error: null,
            };

        case CampaignActionTypes.LOAD_CAMPAIGNS_SUCCESS:
            return campaignsAdapter.setAll(action.payload.campaigns, {
                ...state,
                loading: false,
                error: null,
                pagination: action.payload.pagination
            });

        case CampaignActionTypes.LOAD_CAMPAIGNS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        case CampaignActionTypes.LOAD_CAMPAIGN_BY_ID_SUCCESS:
            return campaignsAdapter.upsertOne(action.payload.campaign, {
                ...state,
                loading: false,
                error: null,
                selectedCampaignId: action.payload.campaign.id
            });

        case CampaignActionTypes.LOAD_CAMPAIGN_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        case CampaignActionTypes.SET_SORT:
            return {
                ...state,
                sort: action.payload
            };

        case CampaignActionTypes.CREATE_CAMPAIGN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        case CampaignActionTypes.UPDATE_CAMPAIGN_SUCCESS:
            return campaignsAdapter.updateOne(
                { id: action.payload.campaign.id, changes: action.payload.campaign },
                {
                    ...state,
                    selectedCampaignId: action.payload.campaign.id,
                    loading: false,
                    error: null
                }
            );

        case CampaignActionTypes.UPDATE_CAMPAIGN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        case CampaignActionTypes.DELETE_CAMPAIGN_SUCCESS:
            return campaignsAdapter.removeOne(action.payload.id, {
                ...state,
                selectedCampaignId: null,
                loading: false,
                error: null
            });

        case CampaignActionTypes.DELETE_CAMPAIGN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        case CampaignActionTypes.SELECT_CAMPAIGN:
            return {
                ...state,
                selectedCampaignId: action.payload.id
            };

        case CampaignActionTypes.SET_SORT:
            return {
                ...state,
                sort: {
                    property: action.payload.property,
                    direction: action.payload.direction
                }
            };

        case CampaignActionTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        case CampaignActionTypes.RESET_STATE:
            return CAMPAIGN_INITIAL_STATE;

        default:
            return state;
    }
}
