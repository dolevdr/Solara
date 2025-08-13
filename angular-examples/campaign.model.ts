// Example TypeScript interfaces for the Angular frontend

export interface Campaign {
  id: string;
  userId: string;
  prompt: string;
  status: CampaignStatus;
  generatedText?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  error?: string;
  processingTime?: number;
}

export type CampaignStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface CreateCampaignRequest {
  userId: string;
  prompt: string;
}

export interface CampaignListResponse {
  campaigns: Campaign[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
}