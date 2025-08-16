import { Injectable, NotFoundException } from '@nestjs/common';
import { Result } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) { }

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
    content?: string;
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

  async getImagePath(campaignId: string): Promise<string> {
    const result = await this.findByCampaignId(campaignId);
    if (!result) {
      throw new NotFoundException('No campaign found');
    }

    if (!result.content) {
      return null;
    }

    const imagePath = path.join(process.cwd(), '..', 'output', result.content);

    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException('Image file not found');
    }

    return imagePath;
  }
}
