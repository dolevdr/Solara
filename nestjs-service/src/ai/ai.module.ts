import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIProxyService } from './ai-proxy.service';

@Module({
  imports: [ConfigModule],
  providers: [AIProxyService],
  exports: [AIProxyService],
})
export class AIModule {}
