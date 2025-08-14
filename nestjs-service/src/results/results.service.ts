import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Result } from '@prisma/client';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  async createResult(data: {
    campaignId: string;
    contentUrl?: string;
    contentText?: string;
  }): Promise<Result> {
    return this.prisma.result.create({
      data,
      include: {
        campaign: true,
      },
    });
  }

  async findByCampaignId(campaignId: string): Promise<Result> {
    const result = await this.prisma.result.findUnique({
      where: { campaignId },
      include: {
        campaign: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Result for campaign ${campaignId} not found`);
    }

    return result;
  }

  async updateResult(campaignId: string, data: {
    contentUrl?: string;
    contentText?: string;
  }): Promise<Result> {
    return this.prisma.result.update({
      where: { campaignId },
      data,
      include: {
        campaign: true,
      },
    });
  }

  async deleteResult(campaignId: string): Promise<Result> {
    return this.prisma.result.delete({
      where: { campaignId },
      include: {
        campaign: true,
      },
    });
  }
}
