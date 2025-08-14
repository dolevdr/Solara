import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Campaign, CampaignStatus } from '@prisma/client';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { AIProxyService } from '../ai/ai-proxy.service';
import { ResultsService } from '../results/results.service';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { QueryCampaignsDto } from './dto/query-campaigns.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { WebhookDto } from './dto/webhook.dto';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly resultsService: ResultsService,
    private readonly aiProxyService: AIProxyService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    return this.campaignService.create(createCampaignDto);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook endpoint for AI service to notify about completed generations' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook data' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async webhook(@Body() webhookData: WebhookDto) {
    return this.campaignService.handleWebhook(webhookData);
  }

  @Get()
  @ApiOperation({ summary: 'List all campaigns with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  async findAll(@Query() query: QueryCampaignsDto) {
    return this.campaignService.findAll(query);
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint for monitoring' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      aiService: await this.aiProxyService.healthCheck()
    };
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get campaigns by status' })
  @ApiParam({ name: 'status', enum: ['pending', 'processing', 'completed', 'failed'] })
  async getByStatus(@Param('status') status: CampaignStatus): Promise<Campaign[]> {
    return this.campaignService.getCampaignsByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch the current status and generated results for a campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Campaign found' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async findOne(@Param('id') id: string): Promise<Campaign> {
    return this.campaignService.findOne(id);
  }

  @Get(':id/image')
  @ApiOperation({ summary: 'Serve the generated image file' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Image served successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async serveImage(@Param('id') id: string, @Res() res: Response) {
    const campaign = await this.campaignService.findOne(id);

    // Use the resultsService to get the result for this campaign
    const result = await this.resultsService.findByCampaignId(id);

    if (!result?.contentUrl) {
      throw new Error('No image found for this campaign');
    }

    const imagePath = path.join(process.cwd(), '..', 'output', result.contentUrl);

    if (!fs.existsSync(imagePath)) {
      throw new Error('Image file not found');
    }

    res.sendFile(imagePath);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Campaign updated successfully' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ): Promise<Campaign> {
    return this.campaignService.update(id, updateCampaignDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update campaign status' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'] } } } })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CampaignStatus,
  ): Promise<Campaign> {
    return this.campaignService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 204, description: 'Campaign deleted successfully' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.campaignService.remove(id);
  }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Retry a failed campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Campaign retry initiated' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async retryCampaign(@Param('id') id: string): Promise<Campaign> {
    return this.campaignService.retryCampaign(id);
  }
}
