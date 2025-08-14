import { Injectable, NotFoundException } from '@nestjs/common';
import { Campaign, CampaignStatus, CampaignType } from '@prisma/client';
import { AIProxyService } from '../ai/ai-proxy.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResultsService } from '../results/results.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { QueryCampaignsDto } from './dto/query-campaigns.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { WebhookDto } from './dto/webhook.dto';

@Injectable()
export class CampaignService {
  constructor(
    private prisma: PrismaService,
    private resultsService: ResultsService,
    private aiProxyService: AIProxyService,
  ) { }

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const campaign = await this.prisma.campaign.create({
      data: {
        title: createCampaignDto.title,
        prompt: createCampaignDto.prompt,
        type: createCampaignDto.type,
        status: CampaignStatus.pending,
        result: {
          create: {
            contentUrl: null,
            contentText: null,
          }
        }
      },
      include: {
        result: true,
      },
    });

    return campaign;
  }

  async findAll(query: QueryCampaignsDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    return this.prisma.$transaction([
      this.prisma.campaign.findMany({
        include: {
          result: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.campaign.count(),
    ]).then(([campaigns, total]) => ({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }));
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        result: true,
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    return this.prisma.campaign.update({
      where: { id },
      data: updateCampaignDto,
      include: {
        result: true,
      },
    });
  }

  async updateStatus(id: string, status: CampaignStatus): Promise<Campaign> {
    return this.prisma.campaign.update({
      where: { id },
      data: { status },
      include: {
        result: true,
      },
    });
  }

  async remove(id: string): Promise<Campaign> {
    return this.prisma.campaign.delete({
      where: { id },
      include: {
        result: true,
      },
    });
  }

  async getCampaignsByStatus(status: CampaignStatus): Promise<Campaign[]> {
    return this.prisma.campaign.findMany({
      where: { status },
      include: {
        result: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async handleWebhook(webhookData: WebhookDto): Promise<{ success: boolean; message: string }> {
    try {
      const { track_id, status, output, message } = webhookData;

      if (!track_id) {
        throw new Error('track_id is required');
      }

      const campaignStatus = status === 'success' ? CampaignStatus.completed : CampaignStatus.failed;

      await this.prisma.$transaction([
        this.prisma.campaign.update({
          where: { id: track_id },
          data: { status: campaignStatus },

        }),
        this.prisma.result.update({
          where: { campaignId: track_id },
          data: { contentUrl: output[0] ?? null },
        }),
      ]);

      return {
        success: true,
        message: status === 'success'
          ? 'Campaign updated successfully with generated image'
          : `Campaign marked as failed: ${message || 'Unknown error'}`
      };
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }

  async retryCampaign(id: string): Promise<Campaign> {
    const campaign = await this.findOne(id);

    if (campaign.status !== 'failed') {
      throw new Error('Only failed campaigns can be retried');
    }

    // Reset status and retry processing
    await this.updateStatus(id, 'pending');

    // For retry, we'll use basic parameters since we don't have the original DTO
    const basicDto = {
      title: campaign.title,
      prompt: campaign.prompt,
      type: campaign.type,
    } as CreateCampaignDto;

    this.processCampaign(campaign, basicDto);

    return campaign;
  }

  private async processCampaign(campaign: Campaign, createCampaignDto: CreateCampaignDto): Promise<void> {
    try {
      // Update status to processing
      await this.updateStatus(campaign.id, 'processing');

      if (campaign.type === CampaignType.text) {
        const aiResponse = await this.aiProxyService.generateText({ prompt: campaign.prompt });

        if (aiResponse.success) {
          await this.resultsService.createResult({
            campaignId: campaign.id,
            contentText: aiResponse.text,
          });
          await this.updateStatus(campaign.id, 'completed');
        } else {
          throw new Error(aiResponse.error || 'Text generation failed');
        }
      } else if (campaign.type === CampaignType.image) {
        // Extract image generation parameters from the DTO
        const imageRequest = {
          prompt: campaign.prompt,
          negative_prompt: createCampaignDto.negative_prompt,
          width: createCampaignDto.width,
          height: createCampaignDto.height,
          samples: createCampaignDto.samples,
          safety_checker: createCampaignDto.safety_checker,
          seed: createCampaignDto.seed,
          base64: createCampaignDto.base64,
          enhance_prompt: createCampaignDto.enhance_prompt,
          track_id: campaign.id, // Pass campaign ID as track_id
        };

        const aiResponse = await this.aiProxyService.generateImage(imageRequest);

        if (aiResponse.success) {
          await this.resultsService.createResult({
            campaignId: campaign.id,
            contentUrl: aiResponse.imageUrl,
          });
          await this.updateStatus(campaign.id, 'completed');
        } else {
          throw new Error(aiResponse.error || 'Image generation failed');
        }
      }
    } catch (error) {
      console.error(`Error processing campaign ${campaign.id}:`, error);
      await this.updateStatus(campaign.id, CampaignStatus.failed);
    }
  }
}
