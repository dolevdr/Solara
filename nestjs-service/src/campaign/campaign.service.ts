import { Injectable } from '@nestjs/common';

@Injectable()
export class CampaignService {
  private jobs = new Map<string, any>();

  create(payload: any) {
    const id = payload.campaignId || Math.random().toString(36).slice(2, 8);
    this.jobs.set(id, { status: 'pending', ...payload });
    return { campaignId: id, status: 'pending' };
  }

  status(id: string) {
    return this.jobs.get(id) || { campaignId: id, status: 'unknown' };
  }
}
