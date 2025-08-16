import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { StatusEnum } from '../../shared/interfaces/status.enum';
import { Campaign, CampaignType } from '../types/campaign.interface';
import {
    CreateCampaign,
    CreateCampaignFailure,
    DeleteCampaign,
    DeleteCampaignFailure,
    DeleteCampaignSuccess,
    LoadCampaignById,
    LoadCampaignByIdFailure,
    LoadCampaignByIdSuccess,
    LoadCampaignPagination,
    LoadCampaigns,
    LoadCampaignsFailure,
    LoadCampaignsSuccess,
    ResetCampaignsState,
    UpdateCampaign,
    UpdateCampaignFailure,
    UpdateCampaignSuccess
} from './campaigns.actions';
import { CampaignsEffects } from './campaigns.effects';
import { selectAllCampaigns, selectPagination } from './campaigns.selectors';
import { CampaignsService } from './campaigns.service';

describe('CampaignsEffects', () => {
    let effects: CampaignsEffects;
    let actions$: Actions;
    let campaignsService: jest.Mocked<CampaignsService>;
    let router: jest.Mocked<Router>;

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

    const mockCampaignsResponse = {
        campaigns: [mockCampaign],
        pagination: {
            page: 1,
            limit: 10,
            total: 1,
            pages: 1
        }
    };

    beforeEach(() => {
        const campaignsServiceMock = {
            getCampaigns: jest.fn(),
            getCampaignById: jest.fn(),
            createCampaign: jest.fn(),
            updateCampaign: jest.fn(),
            deleteCampaign: jest.fn()
        };

        const routerMock = {
            navigate: jest.fn()
        };

        TestBed.configureTestingModule({
            providers: [
                CampaignsEffects,
                provideMockActions(() => actions$),
                provideMockStore({
                    selectors: [
                        { selector: selectAllCampaigns, value: [] },
                        { selector: selectPagination, value: null }
                    ]
                }),
                { provide: CampaignsService, useValue: campaignsServiceMock },
                { provide: Router, useValue: routerMock }
            ]
        });

        effects = TestBed.inject(CampaignsEffects);
        actions$ = TestBed.inject(Actions);
        campaignsService = TestBed.inject(CampaignsService) as jest.Mocked<CampaignsService>;
        router = TestBed.inject(Router) as jest.Mocked<Router>;
    });

    describe('loadCampaigns$', () => {
        it('should load campaigns successfully when no campaigns exist', (done) => {
            // Arrange
            const action = new LoadCampaigns();
            const successAction = new LoadCampaignsSuccess(mockCampaignsResponse);

            campaignsService.getCampaigns.mockReturnValue(of(mockCampaignsResponse));
            actions$ = of(action);

            // Act & Assert
            effects.loadCampaigns$.subscribe(result => {
                expect(result).toEqual(successAction);
                expect(campaignsService.getCampaigns).toHaveBeenCalled();
                done();
            });
        });

        it('should handle error when loading campaigns fails', (done) => {
            // Arrange
            const action = new LoadCampaigns();
            const error = new Error('Failed to load campaigns');
            const failureAction = new LoadCampaignsFailure({ error: error.message });

            campaignsService.getCampaigns.mockReturnValue(throwError(() => error));
            actions$ = of(action);

            // Act & Assert
            effects.loadCampaigns$.subscribe(result => {
                expect(result).toEqual(failureAction);
                done();
            });
        });
    });

    describe('loadCampaignPagination$', () => {
        it('should load campaigns with pagination and sorting', (done) => {
            // Arrange
            const action = new LoadCampaignPagination({
                page: 2,
                limit: 5,
                sortBy: 'name',
                direction: 'asc'
            });
            const successAction = new LoadCampaignsSuccess(mockCampaignsResponse);

            campaignsService.getCampaigns.mockReturnValue(of(mockCampaignsResponse));
            actions$ = of(action);

            // Act & Assert
            effects.loadCampaignPagination$.subscribe(result => {
                expect(result).toEqual(successAction);
                expect(campaignsService.getCampaigns).toHaveBeenCalledWith(2, 5, 'name', 'asc');
                done();
            });
        });
    });

    describe('loadCampaignById$', () => {
        it('should load campaign by ID successfully', (done) => {
            // Arrange
            const action = new LoadCampaignById({ id: '1' });
            const successAction = new LoadCampaignByIdSuccess({ campaign: mockCampaign });

            campaignsService.getCampaignById.mockReturnValue(of(mockCampaign));
            actions$ = of(action);

            // Act & Assert
            effects.loadCampaignById$.subscribe(result => {
                expect(result).toEqual(successAction);
                expect(campaignsService.getCampaignById).toHaveBeenCalledWith('1');
                done();
            });
        });

        it('should handle error when loading campaign by ID fails', (done) => {
            // Arrange
            const action = new LoadCampaignById({ id: '1' });
            const error = new Error('Campaign not found');
            const failureAction = new LoadCampaignByIdFailure({ error: error.message });

            campaignsService.getCampaignById.mockReturnValue(throwError(() => error));
            actions$ = of(action);

            // Act & Assert
            effects.loadCampaignById$.subscribe(result => {
                expect(result).toEqual(failureAction);
                done();
            });
        });
    });

    describe('createCampaign$', () => {
        it('should create campaign and navigate to campaigns page', (done) => {
            // Arrange
            const newCampaign = { name: 'New Campaign', type: CampaignType.TEXT, prompt: 'New prompt' };
            const action = new CreateCampaign({ campaign: newCampaign });
            const successAction = new ResetCampaignsState();

            campaignsService.createCampaign.mockReturnValue(of(mockCampaign));
            actions$ = of(action);

            // Act & Assert
            effects.createCampaign$.subscribe(result => {
                expect(result).toEqual(successAction);
                expect(campaignsService.createCampaign).toHaveBeenCalledWith(newCampaign);
                expect(router.navigate).toHaveBeenCalledWith(['/campaigns']);
                done();
            });
        });

        it('should handle error when creating campaign fails', (done) => {
            // Arrange
            const newCampaign = { name: 'New Campaign', type: CampaignType.TEXT, prompt: 'New prompt' };
            const action = new CreateCampaign({ campaign: newCampaign });
            const error = new Error('Failed to create campaign');
            const failureAction = new CreateCampaignFailure({ error: error.message });

            campaignsService.createCampaign.mockReturnValue(throwError(() => error));
            actions$ = of(action);

            // Act & Assert
            effects.createCampaign$.subscribe(result => {
                expect(result).toEqual(failureAction);
                done();
            });
        });
    });

    describe('updateCampaign$', () => {
        it('should update campaign successfully', (done) => {
            // Arrange
            const updatedCampaign = { name: 'Updated Campaign' };
            const action = new UpdateCampaign({ id: '1', campaign: updatedCampaign });
            const successAction = new UpdateCampaignSuccess({ campaign: mockCampaign });

            campaignsService.updateCampaign.mockReturnValue(of(mockCampaign));
            actions$ = of(action);

            // Act & Assert
            effects.updateCampaign$.subscribe(result => {
                expect(result).toEqual(successAction);
                expect(campaignsService.updateCampaign).toHaveBeenCalledWith('1', updatedCampaign);
                done();
            });
        });

        it('should handle error when updating campaign fails', (done) => {
            // Arrange
            const updatedCampaign = { name: 'Updated Campaign' };
            const action = new UpdateCampaign({ id: '1', campaign: updatedCampaign });
            const error = new Error('Failed to update campaign');
            const failureAction = new UpdateCampaignFailure({ error: error.message });

            campaignsService.updateCampaign.mockReturnValue(throwError(() => error));
            actions$ = of(action);

            // Act & Assert
            effects.updateCampaign$.subscribe(result => {
                expect(result).toEqual(failureAction);
                done();
            });
        });
    });

    describe('deleteCampaign$', () => {
        it('should delete campaign successfully', (done) => {
            // Arrange
            const action = new DeleteCampaign({ id: '1' });
            const successAction = new DeleteCampaignSuccess({ id: '1' });

            campaignsService.deleteCampaign.mockReturnValue(of(void 0));
            actions$ = of(action);

            // Act & Assert
            effects.deleteCampaign$.subscribe(result => {
                expect(result).toEqual(successAction);
                expect(campaignsService.deleteCampaign).toHaveBeenCalledWith('1');
                done();
            });
        });

        it('should handle error when deleting campaign fails', (done) => {
            // Arrange
            const action = new DeleteCampaign({ id: '1' });
            const error = new Error('Failed to delete campaign');
            const failureAction = new DeleteCampaignFailure({ error: error.message });

            campaignsService.deleteCampaign.mockReturnValue(throwError(() => error));
            actions$ = of(action);

            // Act & Assert
            effects.deleteCampaign$.subscribe(result => {
                expect(result).toEqual(failureAction);
                done();
            });
        });
    });
});
