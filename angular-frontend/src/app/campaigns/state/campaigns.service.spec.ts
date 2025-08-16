import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StatusEnum } from '../../shared/interfaces/status.enum';
import { Campaign, CampaignType } from '../types/campaign.interface';
import { CampaignsService } from './campaigns.service';

describe('CampaignsService', () => {
    let service: CampaignsService;
    let httpMock: HttpTestingController;

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
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CampaignsService]
        });

        service = TestBed.inject(CampaignsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('getCampaigns', () => {
        it('should get campaigns with default parameters', () => {
            service.getCampaigns().subscribe(response => {
                expect(response).toEqual(mockCampaignsResponse);
            });

            const req = httpMock.expectOne('http://localhost:3000/campaigns?page=1&limit=10&sortBy=createdAt&direction=desc');
            expect(req.request.method).toBe('GET');
            req.flush(mockCampaignsResponse);
        });

        it('should get campaigns with custom parameters', () => {
            service.getCampaigns(2, 5, 'name', 'asc').subscribe(response => {
                expect(response).toEqual(mockCampaignsResponse);
            });

            const req = httpMock.expectOne('http://localhost:3000/campaigns?page=2&limit=5&sortBy=name&direction=asc');
            expect(req.request.method).toBe('GET');
            req.flush(mockCampaignsResponse);
        });

        it('should handle error when getting campaigns fails', () => {
            const errorMessage = 'Failed to load campaigns';

            service.getCampaigns().subscribe({
                next: () => fail('should have failed'),
                error: (error) => {
                    expect(error.status).toBe(500);
                    expect(error.statusText).toBe('Internal Server Error');
                }
            });

            const req = httpMock.expectOne('http://localhost:3000/campaigns?page=1&limit=10&sortBy=createdAt&direction=desc');
            req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
        });
    });

    describe('getCampaignById', () => {
        it('should get campaign by ID', () => {
            service.getCampaignById('1').subscribe(campaign => {
                expect(campaign).toEqual(mockCampaign);
            });

            const req = httpMock.expectOne('http://localhost:3000/campaigns/1');
            expect(req.request.method).toBe('GET');
            req.flush(mockCampaign);
        });

        it('should handle error when getting campaign by ID fails', () => {
            service.getCampaignById('1').subscribe({
                next: () => fail('should have failed'),
                error: (error) => {
                    expect(error.status).toBe(404);
                    expect(error.statusText).toBe('Not Found');
                }
            });

            const req = httpMock.expectOne('http://localhost:3000/campaigns/1');
            req.flush('Campaign not found', { status: 404, statusText: 'Not Found' });
        });
    });

    describe('createCampaign', () => {
        it('should create campaign', () => {
            const newCampaign = {
                name: 'New Campaign',
                type: CampaignType.TEXT,
                prompt: 'New prompt'
            };

            service.createCampaign(newCampaign).subscribe(campaign => {
                expect(campaign).toEqual(mockCampaign);
            });

            const req = httpMock.expectOne('http://localhost:3000/campaigns');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(newCampaign);
            req.flush(mockCampaign);
        });

        it('should handle error when creating campaign fails', () => {
            const newCampaign = {
                name: 'New Campaign',
                type: CampaignType.TEXT,
                prompt: 'New prompt'
            };

            service.createCampaign(newCampaign).subscribe({
                next: () => fail('should have failed'),
                error: (error) => {
                    expect(error.status).toBe(400);
                    expect(error.statusText).toBe('Bad Request');
                }
            });

            const req = httpMock.expectOne('http://localhost:3000/campaigns');
            req.flush('Invalid campaign data', { status: 400, statusText: 'Bad Request' });
        });
    });

    describe('updateCampaign', () => {
        it('should update campaign', () => {
            const updatedCampaign = {
                name: 'Updated Campaign'
            };

            service.updateCampaign('1', updatedCampaign).subscribe(campaign => {
                expect(campaign).toEqual(mockCampaign);
            });

            const req = httpMock.expectOne('http://localhost:3000/campaigns/1');
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(updatedCampaign);
            req.flush(mockCampaign);
        });

        it('should handle error when updating campaign fails', () => {
            const updatedCampaign = {
                name: 'Updated Campaign'
            };

            service.updateCampaign('1', updatedCampaign).subscribe({
                next: () => fail('should have failed'),
                error: (error) => {
                    expect(error.status).toBe(404);
                    expect(error.statusText).toBe('Not Found');
                }
            });

            const req = httpMock.expectOne('http://localhost:3000/campaigns/1');
            req.flush('Campaign not found', { status: 404, statusText: 'Not Found' });
        });
    });

    describe('deleteCampaign', () => {
        it('should delete campaign', () => {
            service.deleteCampaign('1').subscribe(response => {
                expect(response).toBeUndefined();
            });

            const req = httpMock.expectOne('http://localhost:3000/campaigns/1');
            expect(req.request.method).toBe('DELETE');
            req.flush(null);
        });

        it('should handle error when deleting campaign fails', () => {
            service.deleteCampaign('1').subscribe({
                next: () => fail('should have failed'),
                error: (error) => {
                    expect(error.status).toBe(404);
                    expect(error.statusText).toBe('Not Found');
                }
            });

            const req = httpMock.expectOne('http://localhost:3000/campaigns/1');
            req.flush('Campaign not found', { status: 404, statusText: 'Not Found' });
        });
    });

    describe('URL Construction', () => {
        it('should construct correct URLs for different operations', () => {
            // Test getCampaigns URL
            service.getCampaigns().subscribe();
            let req = httpMock.expectOne('http://localhost:3000/campaigns?page=1&limit=10&sortBy=createdAt&direction=desc');
            expect(req.request.url).toBe('http://localhost:3000/campaigns');
            req.flush(mockCampaignsResponse);

            // Test getCampaignById URL
            service.getCampaignById('123').subscribe();
            req = httpMock.expectOne('http://localhost:3000/campaigns/123');
            expect(req.request.url).toBe('http://localhost:3000/campaigns/123');
            req.flush(mockCampaign);

            // Test updateCampaign URL
            service.updateCampaign('456', {}).subscribe();
            req = httpMock.expectOne('http://localhost:3000/campaigns/456');
            expect(req.request.url).toBe('http://localhost:3000/campaigns/456');
            req.flush(mockCampaign);

            // Test deleteCampaign URL
            service.deleteCampaign('789').subscribe();
            req = httpMock.expectOne('http://localhost:3000/campaigns/789');
            expect(req.request.url).toBe('http://localhost:3000/campaigns/789');
            req.flush(null);
        });
    });

    describe('Parameter Handling', () => {
        it('should handle different parameter combinations for getCampaigns', () => {
            // Test with only page
            service.getCampaigns(3).subscribe();
            let req = httpMock.expectOne('http://localhost:3000/campaigns?page=3&limit=10&sortBy=createdAt&direction=desc');
            req.flush(mockCampaignsResponse);

            // Test with page and limit
            service.getCampaigns(2, 20).subscribe();
            req = httpMock.expectOne('http://localhost:3000/campaigns?page=2&limit=20&sortBy=createdAt&direction=desc');
            req.flush(mockCampaignsResponse);

            // Test with all parameters
            service.getCampaigns(1, 5, 'name', 'asc').subscribe();
            req = httpMock.expectOne('http://localhost:3000/campaigns?page=1&limit=5&sortBy=name&direction=asc');
            req.flush(mockCampaignsResponse);
        });
    });
});
