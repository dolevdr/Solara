import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CampaignService } from './campaign.service';

@Controller()
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post('generate-campaign')
  async generateCampaign(@Body() body: any) {
    return this.campaignService.create(body);
  }

  @Get('campaign-status/:id')
  async getStatus(@Param('id') id: string) {
    return this.campaignService.status(id);
  }
}
