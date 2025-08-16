import { StatusEnum } from '../../shared/interfaces/status.enum';
import { Campaign, CampaignType } from '../types/campaign.interface';
import { CampaignActions, CampaignActionTypes } from './campaigns.actions';
import { campaignsReducer } from './campaigns.reducers';
import { CAMPAIGN_INITIAL_STATE } from './campaigns.state';

describe('Campaigns Reducer', () => {
    const mockCampaign: Campaign = {
        id: '1',
        name: 'Test Campaign',
        prompt: 'Test prompt',
        type: CampaignType.TEXT,
        status: StatusEnum.COMPLETED,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        result: { content: 'Test result' }
    };

    const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        pages: 1
    };

    describe('Initial State', () => {
        it('should return initial state when no action is provided', () => {
            const result = campaignsReducer(undefined, {} as CampaignActions);
            expect(result).toEqual(CAMPAIGN_INITIAL_STATE);
        });

        it('should return initial state when unknown action is provided', () => {
            const unknownAction = { type: 'UNKNOWN_ACTION' } as any;
            const result = campaignsReducer(CAMPAIGN_INITIAL_STATE, unknownAction);
            expect(result).toEqual(CAMPAIGN_INITIAL_STATE);
        });
    });

    describe('Loading Actions', () => {
        it('should set loading to true for LOAD_CAMPAIGNS', () => {
            const action = { type: CampaignActionTypes.LOAD_CAMPAIGNS };
            const result = campaignsReducer(CAMPAIGN_INITIAL_STATE, action as CampaignActions);

            expect(result.loading).toBe(true);
            expect(result.error).toBe(null);
        });

        it('should set loading to true for LOAD_CAMPAIGN_PAGINATION', () => {
            const action = { type: CampaignActionTypes.LOAD_CAMPAIGN_PAGINATION };
            const result = campaignsReducer(CAMPAIGN_INITIAL_STATE, action as CampaignActions);

            expect(result.loading).toBe(true);
            expect(result.error).toBe(null);
        });

        it('should set loading to true for LOAD_CAMPAIGN_BY_ID', () => {
            const action = { type: CampaignActionTypes.LOAD_CAMPAIGN_BY_ID };
            const result = campaignsReducer(CAMPAIGN_INITIAL_STATE, action as CampaignActions);

            expect(result.loading).toBe(true);
            expect(result.error).toBe(null);
        });

        it('should set loading to true for CREATE_CAMPAIGN', () => {
            const action = { type: CampaignActionTypes.CREATE_CAMPAIGN };
            const result = campaignsReducer(CAMPAIGN_INITIAL_STATE, action as CampaignActions);

            expect(result.loading).toBe(true);
            expect(result.error).toBe(null);
        });

        it('should set loading to true for UPDATE_CAMPAIGN', () => {
            const action = { type: CampaignActionTypes.UPDATE_CAMPAIGN };
            const result = campaignsReducer(CAMPAIGN_INITIAL_STATE, action as CampaignActions);

            expect(result.loading).toBe(true);
            expect(result.error).toBe(null);
        });

        it('should set loading to true for DELETE_CAMPAIGN', () => {
            const action = { type: CampaignActionTypes.DELETE_CAMPAIGN };
            const result = campaignsReducer(CAMPAIGN_INITIAL_STATE, action as CampaignActions);

            expect(result.loading).toBe(true);
            expect(result.error).toBe(null);
        });
    });

    describe('Load Campaigns Success', () => {
        it('should update state with campaigns and pagination', () => {
            const action = {
                type: CampaignActionTypes.LOAD_CAMPAIGNS_SUCCESS,
                payload: {
                    campaigns: [mockCampaign],
                    pagination: mockPagination
                }
            };

            const initialState = { ...CAMPAIGN_INITIAL_STATE, loading: true };
            const result = campaignsReducer(initialState, action as CampaignActions);

            expect(result.loading).toBe(false);
            expect(result.error).toBe(null);
            expect(result.pagination).toEqual(mockPagination);
            expect(result.ids).toContain('1');
            expect(result.entities['1']).toEqual(mockCampaign);
        });
    });

    describe('Load Campaigns Failure', () => {
        it('should set error and loading to false', () => {
            const errorMessage = 'Failed to load campaigns';
            const action = {
                type: CampaignActionTypes.LOAD_CAMPAIGNS_FAILURE,
                payload: { error: errorMessage }
            };

            const initialState = { ...CAMPAIGN_INITIAL_STATE, loading: true };
            const result = campaignsReducer(initialState, action as CampaignActions);

            expect(result.loading).toBe(false);
            expect(result.error).toBe(errorMessage);
        });
    });

    describe('Load Campaign By ID Success', () => {
        it('should upsert campaign and set selected campaign ID', () => {
            const action = {
                type: CampaignActionTypes.LOAD_CAMPAIGN_BY_ID_SUCCESS,
                payload: { campaign: mockCampaign }
            };

            const initialState = { ...CAMPAIGN_INITIAL_STATE, loading: true };
            const result = campaignsReducer(initialState, action as CampaignActions);

            expect(result.loading).toBe(false);
            expect(result.error).toBe(null);
            expect(result.selectedCampaignId).toBe('1');
            expect(result.entities['1']).toEqual(mockCampaign);
        });
    });

    describe('Load Campaign By ID Failure', () => {
        it('should set error and loading to false', () => {
            const errorMessage = 'Campaign not found';
            const action = {
                type: CampaignActionTypes.LOAD_CAMPAIGN_BY_ID_FAILURE,
                payload: { error: errorMessage }
            };

            const initialState = { ...CAMPAIGN_INITIAL_STATE, loading: true };
            const result = campaignsReducer(initialState, action as CampaignActions);

            expect(result.loading).toBe(false);
            expect(result.error).toBe(errorMessage);
        });
    });

    describe('Set Sort', () => {
        it('should update sort state', () => {
            const sortPayload = { property: 'name' as keyof Campaign, direction: 'asc' as const };
            const action = {
                type: CampaignActionTypes.SET_SORT,
                payload: sortPayload
            };

            const result = campaignsReducer(CAMPAIGN_INITIAL_STATE, action as CampaignActions);

            expect(result.sort).toEqual(sortPayload);
        });
    });

    describe('Create Campaign Failure', () => {
        it('should set error and loading to false', () => {
            const errorMessage = 'Failed to create campaign';
            const action = {
                type: CampaignActionTypes.CREATE_CAMPAIGN_FAILURE,
                payload: { error: errorMessage }
            };

            const initialState = { ...CAMPAIGN_INITIAL_STATE, loading: true };
            const result = campaignsReducer(initialState, action as CampaignActions);

            expect(result.loading).toBe(false);
            expect(result.error).toBe(errorMessage);
        });
    });

    describe('Update Campaign Success', () => {
        it('should update campaign and set selected campaign ID', () => {
            const updatedCampaign = { ...mockCampaign, name: 'Updated Campaign' };
            const action = {
                type: CampaignActionTypes.UPDATE_CAMPAIGN_SUCCESS,
                payload: { campaign: updatedCampaign }
            };

            const initialState = {
                ...CAMPAIGN_INITIAL_STATE,
                loading: true,
                entities: { '1': mockCampaign },
                ids: ['1']
            };
            const result = campaignsReducer(initialState, action as CampaignActions);

            expect(result.loading).toBe(false);
            expect(result.error).toBe(null);
            expect(result.selectedCampaignId).toBe('1');
            expect(result.entities['1']).toEqual(updatedCampaign);
        });
    });

    describe('Update Campaign Failure', () => {
        it('should set error and loading to false', () => {
            const errorMessage = 'Failed to update campaign';
            const action = {
                type: CampaignActionTypes.UPDATE_CAMPAIGN_FAILURE,
                payload: { error: errorMessage }
            };

            const initialState = { ...CAMPAIGN_INITIAL_STATE, loading: true };
            const result = campaignsReducer(initialState, action as CampaignActions);

            expect(result.loading).toBe(false);
            expect(result.error).toBe(errorMessage);
        });
    });

    describe('Delete Campaign Success', () => {
        it('should remove campaign and clear selected campaign ID', () => {
            const action = {
                type: CampaignActionTypes.DELETE_CAMPAIGN_SUCCESS,
                payload: { id: '1' }
            };

            const initialState = {
                ...CAMPAIGN_INITIAL_STATE,
                loading: true,
                selectedCampaignId: '1',
                entities: { '1': mockCampaign },
                ids: ['1']
            };
            const result = campaignsReducer(initialState, action as CampaignActions);

            expect(result.loading).toBe(false);
            expect(result.error).toBe(null);
            expect(result.selectedCampaignId).toBe(null);
            expect(result.entities['1']).toBeUndefined();
            expect(result.ids).not.toContain('1');
        });
    });

    describe('Delete Campaign Failure', () => {
        it('should set error and loading to false', () => {
            const errorMessage = 'Failed to delete campaign';
            const action = {
                type: CampaignActionTypes.DELETE_CAMPAIGN_FAILURE,
                payload: { error: errorMessage }
            };

            const initialState = { ...CAMPAIGN_INITIAL_STATE, loading: true };
            const result = campaignsReducer(initialState, action as CampaignActions);

            expect(result.loading).toBe(false);
            expect(result.error).toBe(errorMessage);
        });
    });

    describe('Select Campaign', () => {
        it('should set selected campaign ID', () => {
            const action = {
                type: CampaignActionTypes.SELECT_CAMPAIGN,
                payload: { id: '2' }
            };

            const result = campaignsReducer(CAMPAIGN_INITIAL_STATE, action as CampaignActions);

            expect(result.selectedCampaignId).toBe('2');
        });
    });

    describe('Clear Error', () => {
        it('should clear error state', () => {
            const action = { type: CampaignActionTypes.CLEAR_ERROR };

            const initialState = { ...CAMPAIGN_INITIAL_STATE, error: 'Some error' };
            const result = campaignsReducer(initialState, action as CampaignActions);

            expect(result.error).toBe(null);
        });
    });

    describe('Reset State', () => {
        it('should reset to initial state', () => {
            const action = { type: CampaignActionTypes.RESET_STATE };

            const modifiedState = {
                ...CAMPAIGN_INITIAL_STATE,
                loading: true,
                error: 'Some error',
                selectedCampaignId: '1',
                entities: { '1': mockCampaign },
                ids: ['1']
            };
            const result = campaignsReducer(modifiedState, action as CampaignActions);

            expect(result).toEqual(CAMPAIGN_INITIAL_STATE);
        });
    });
});
