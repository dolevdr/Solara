import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIModule } from './ai/ai.module';
import { CampaignModule } from './campaign/campaign.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CampaignModule,
    ResultsModule,
    AIModule,
  ],
})
export class AppModule { }
