import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { StatusEnum } from '../../shared/interfaces/status.enum';
import { Campaign, CampaignType } from '../types/campaign.interface';
import {
    selectAllCampaigns,
    selectCampaignEntities,
    selectCampaignIds,
    selectCampaignsError,
    selectCampaignsLoading,
    selectCampaignsState,
    selectCampaignsTableModel,
    selectPagination,
    selectSelectedCampaign,
    selectSelectedCampaignId,
    selectSort,
    selectTotalCampaigns
} from './campaigns.selectors';
import { CAMPAIGNS_FEATURE_KEY } from './campaigns.state';

describe('Campaigns Selectors', () => {
    let store: Store;

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

    const mockState = {
        [CAMPAIGNS_FEATURE_KEY]: {
            ids: ['1', '2'],
            entities: {
                '1': mockCampaign,
                '2': { ...mockCampaign, id: '2', name: 'Test Campaign 2' }
            },
            loading: false,
            error: null,
            selectedCampaignId: '1',
            pagination: {
                page: 1,
                limit: 10,
                total: 2,
                pages: 1
            },
            sort: {
                property: 'name',
                direction: 'asc'
            }
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideMockStore({
                    initialState: mockState
                })
            ]
        });

        store = TestBed.inject(Store);
    });

    describe('selectCampaignsState', () => {
        it('should select the campaigns state', () => {
            let result: any;
            store.select(selectCampaignsState).subscribe(state => {
                result = state;
            });

            expect(result).toEqual(mockState[CAMPAIGNS_FEATURE_KEY]);
        });
    });

    describe('Entity Adapter Selectors', () => {
        describe('selectCampaignIds', () => {
            it('should select campaign IDs', () => {
                let result: any = [];
                store.select(selectCampaignIds).subscribe(ids => {
                    result = ids;
                });

                expect(result).toEqual(['1', '2']);
            });
        });

        describe('selectCampaignEntities', () => {
            it('should select campaign entities', () => {
                let result: any = {};
                store.select(selectCampaignEntities).subscribe(entities => {
                    result = entities;
                });

                expect(result).toEqual({
                    '1': mockCampaign,
                    '2': { ...mockCampaign, id: '2', name: 'Test Campaign 2' }
                });
            });
        });

        describe('selectAllCampaigns', () => {
            it('should select all campaigns as array', () => {
                let result: Campaign[] = [];
                store.select(selectAllCampaigns).subscribe(campaigns => {
                    result = campaigns;
                });

                expect(result).toEqual([
                    mockCampaign,
                    { ...mockCampaign, id: '2', name: 'Test Campaign 2' }
                ]);
            });
        });

        describe('selectTotalCampaigns', () => {
            it('should select total number of campaigns', () => {
                let result = 0;
                store.select(selectTotalCampaigns).subscribe(total => {
                    result = total;
                });

                expect(result).toBe(2);
            });
        });
    });

    describe('Custom Selectors', () => {
        describe('selectCampaignsLoading', () => {
            it('should select loading state', () => {
                let result = true;
                store.select(selectCampaignsLoading).subscribe(loading => {
                    result = loading;
                });

                expect(result).toBe(false);
            });
        });

        describe('selectCampaignsError', () => {
            it('should select error state', () => {
                let result: any = 'some error';
                store.select(selectCampaignsError).subscribe(error => {
                    result = error;
                });

                expect(result).toBe(null);
            });

            it('should select error when present', () => {
                const errorState = {
                    [CAMPAIGNS_FEATURE_KEY]: {
                        ...mockState[CAMPAIGNS_FEATURE_KEY],
                        error: 'Failed to load campaigns'
                    }
                };

                TestBed.resetTestingModule();
                TestBed.configureTestingModule({
                    providers: [
                        provideMockStore({
                            initialState: errorState
                        })
                    ]
                });

                const errorStore = TestBed.inject(Store);
                let result: any = null;
                errorStore.select(selectCampaignsError).subscribe(error => {
                    result = error;
                });

                expect(result).toBe('Failed to load campaigns');
            });
        });

        describe('selectSelectedCampaignId', () => {
            it('should select selected campaign ID', () => {
                let result = null;
                store.select(selectSelectedCampaignId).subscribe(id => {
                    result = id;
                });

                expect(result).toBe('1');
            });
        });

        describe('selectSelectedCampaign', () => {
            it('should select selected campaign when ID exists', () => {
                let result: any = null;
                store.select(selectSelectedCampaign).subscribe(campaign => {
                    result = campaign;
                });

                expect(result).toEqual(mockCampaign);
            });

            it('should return null when no campaign is selected', () => {
                const noSelectionState = {
                    [CAMPAIGNS_FEATURE_KEY]: {
                        ...mockState[CAMPAIGNS_FEATURE_KEY],
                        selectedCampaignId: null
                    }
                };

                TestBed.resetTestingModule();
                TestBed.configureTestingModule({
                    providers: [
                        provideMockStore({
                            initialState: noSelectionState
                        })
                    ]
                });

                const noSelectionStore = TestBed.inject(Store);
                let result: any = mockCampaign;
                noSelectionStore.select(selectSelectedCampaign).subscribe(campaign => {
                    result = campaign;
                });

                expect(result).toBe(null);
            });
        });

        describe('selectPagination', () => {
            it('should select pagination state', () => {
                let result: any = null;
                store.select(selectPagination).subscribe(pagination => {
                    result = pagination;
                });

                expect(result).toEqual({
                    page: 1,
                    limit: 10,
                    total: 2,
                    pages: 1
                });
            });
        });

        describe('selectSort', () => {
            it('should select sort state', () => {
                let result: any = null;
                store.select(selectSort).subscribe(sort => {
                    result = sort;
                });

                expect(result).toEqual({
                    property: 'name',
                    direction: 'asc'
                });
            });
        });
    });

    describe('Combined Selectors', () => {
        describe('selectCampaignsTableModel', () => {
            it('should select combined table model', () => {
                let result: any = null;
                store.select(selectCampaignsTableModel).subscribe(model => {
                    result = model;
                });

                expect(result).toEqual({
                    campaigns: [
                        mockCampaign,
                        { ...mockCampaign, id: '2', name: 'Test Campaign 2' }
                    ],
                    loading: false,
                    error: null,
                    pagination: {
                        page: 1,
                        limit: 10,
                        total: 2,
                        pages: 1
                    },
                    sort: {
                        property: 'name',
                        direction: 'asc'
                    }
                });
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty state', () => {
            const emptyState = {
                [CAMPAIGNS_FEATURE_KEY]: {
                    ids: [],
                    entities: {},
                    loading: false,
                    error: null,
                    selectedCampaignId: null,
                    pagination: null,
                    sort: {
                        property: 'createdAt',
                        direction: 'desc'
                    }
                }
            };

            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    provideMockStore({
                        initialState: emptyState
                    })
                ]
            });

            const emptyStore = TestBed.inject(Store);

            // Test all selectors with empty state
            let campaigns: Campaign[] = [];
            let total = -1;
            let loading = true;
            let error: any = 'some error';
            let selectedCampaign: any = mockCampaign;

            emptyStore.select(selectAllCampaigns).subscribe(c => campaigns = c);
            emptyStore.select(selectTotalCampaigns).subscribe(t => total = t);
            emptyStore.select(selectCampaignsLoading).subscribe(l => loading = l);
            emptyStore.select(selectCampaignsError).subscribe(e => error = e);
            emptyStore.select(selectSelectedCampaign).subscribe(s => selectedCampaign = s);

            expect(campaigns).toEqual([]);
            expect(total).toBe(0);
            expect(loading).toBe(false);
            expect(error).toBe(null);
            expect(selectedCampaign).toBe(null);
        });
    });
});
