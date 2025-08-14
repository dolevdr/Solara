import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';

export interface GenerateTextRequest {
  prompt: string;
}

export interface GenerateImageRequest {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  samples?: number;
  safety_checker?: boolean;
  seed?: number | null;
  base64?: boolean;
  enhance_prompt?: boolean;
}

export interface BaseAIResponse {
  success: boolean;
  error?: string;
}

export interface GenerateTextResponse extends BaseAIResponse {
  text: string;
}

export interface GenerateImageResponse extends BaseAIResponse {
  imageUrl: string;
  generationTime?: number;
  id?: number;
  output?: string[];
  proxy_links?: string[];
  meta?: any;
}

export interface ModelslabImageRequest {
  key: string;
  prompt: string;
  negative_prompt?: string;
  width?: string;
  height?: string;
  samples?: number;
  safety_checker?: boolean;
  seed?: number | null;
  instant_response?: boolean;
  base64?: boolean;
  webhook?: string | null;
  track_id?: string | null;
  enhance_prompt?: boolean;
}

export interface ModelslabImageResponse {
  status: 'success' | 'processing' | 'error';
  generationTime?: number;
  id?: number;
  output?: string[];
  proxy_links?: string[];
  meta?: any;
  message?: string;
  eta?: number;
  fetch_result?: string;
  future_links?: string[];
}

export type AIResponse = GenerateTextResponse | GenerateImageResponse;

@Injectable()
export class AIProxyService {
  private readonly logger = new Logger(AIProxyService.name);
  private readonly aiServiceUrl: string;
  private readonly timeout: number;
  private readonly modelslabApiKey: string;
  private readonly modelslabApiUrl: string;

  constructor(private configService: ConfigService) {
    this.aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
    this.timeout = this.configService.get<number>('AI_SERVICE_TIMEOUT', 30000);
    this.modelslabApiKey = this.configService.get<string>('MODELSLAB_API_KEY', '');
    this.modelslabApiUrl = 'https://modelslab.com/api/v6/realtime/text2img';
  }

  async generateText(request: GenerateTextRequest): Promise<GenerateTextResponse> {
    try {
      this.logger.log(`Generating text for prompt: ${request.prompt.substring(0, 50)}...`);

      const response: AxiosResponse<GenerateTextResponse> = await axios.post(
        `${this.aiServiceUrl}/generate-text`,
        request,
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.log('Text generation completed successfully');
      return response.data;
    } catch (error) {
      this.logger.error(`Text generation failed: ${error.message}`);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new HttpException('AI service timeout', HttpStatus.REQUEST_TIMEOUT);
        }
        if (error.response) {
          throw new HttpException(
            error.response.data?.error || 'AI service error',
            error.response.status
          );
        }
      }

      throw new HttpException('AI service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async generateImage(request: GenerateImageRequest): Promise<GenerateImageResponse> {
    try {
      this.logger.log(`Generating image for prompt: ${request.prompt.substring(0, 50)}...`);

      const response: AxiosResponse<GenerateImageResponse> = await axios.post(
        `${this.aiServiceUrl}/generate-image`,
        request,
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.log('Image generation completed successfully');
      return response.data;
    } catch (error) {
      this.logger.error(`Image generation failed: ${error.message}`);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new HttpException('AI service timeout', HttpStatus.REQUEST_TIMEOUT);
        }
        if (error.response) {
          throw new HttpException(
            error.response.data?.error || 'AI service error',
            error.response.status
          );
        }
      }

      throw new HttpException('AI service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/health`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      this.logger.warn(`AI service health check failed: ${error.message}`);
      return false;
    }
  }
}
