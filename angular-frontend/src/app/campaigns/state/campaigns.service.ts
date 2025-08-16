import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FieldEnum } from '../../shared/interfaces/field.enum';
import { Campaign, CampaignsResponse } from '../types/campaign.interface';


@Injectable({
    providedIn: 'root'
})
export class CampaignsService {
    private apiUrl = `${environment.apiUrl}/campaigns`;

    constructor(private http: HttpClient) { }

    getCampaigns(page: number = 1, limit: number = 10, sortBy: string = FieldEnum.CREATED_AT, direction: SortDirection = 'desc'): Observable<CampaignsResponse> {
        const params = { page: page.toString(), limit: limit.toString(), sortBy, direction };
        return this.http.get<CampaignsResponse>(this.apiUrl, { params });
    }

    getCampaignById(id: string): Observable<Campaign> {

        return this.http.get<Campaign>(`${this.apiUrl}/${id}`);
    }

    createCampaign(campaign: Partial<Campaign>): Observable<Campaign> {
        return this.http.post<Campaign>(this.apiUrl, campaign);
    }

    updateCampaign(id: string, campaign: Partial<Campaign>): Observable<Campaign> {
        return this.http.put<Campaign>(`${this.apiUrl}/${id}`, campaign);
    }

    deleteCampaign(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
