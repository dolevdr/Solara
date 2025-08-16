import { SortDirection } from '@angular/material/sort';
import { StatusEnum } from '../../shared/interfaces/status.enum';

export interface Campaign {
    id: string;
    name: string;
    prompt: string;
    type: CampaignType;
    status: StatusEnum;
    createdAt: Date;
    updatedAt: Date;
    result?: { content: string }
}

export enum CampaignType {
    TEXT = 'text',
    IMAGE = 'image'
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface CampaignsResponse {
    campaigns: Campaign[];
    pagination: Pagination;
}

export interface SortState {
    property: keyof Campaign;
    direction: SortDirection;
}

