import { Module } from '@nestjs/common';
import { AIModule } from '../ai/ai.module';
import { ResultsModule } from '../results/results.module';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';

@Module({
  imports: [ResultsModule, AIModule],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule { }
