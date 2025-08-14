import { IsString, IsEnum, IsOptional, MinLength, MaxLength, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { CampaignType } from '@prisma/client';

export class CreateCampaignDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  prompt: string;

  @IsEnum(CampaignType)
  type: CampaignType;

  // Image generation specific parameters
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  negative_prompt?: string;

  @IsOptional()
  @IsNumber()
  @Min(256)
  @Max(1024)
  width?: number;

  @IsOptional()
  @IsNumber()
  @Min(256)
  @Max(1024)
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  samples?: number;

  @IsOptional()
  @IsBoolean()
  safety_checker?: boolean;

  @IsOptional()
  @IsNumber()
  seed?: number;

  @IsOptional()
  @IsBoolean()
  base64?: boolean;

  @IsOptional()
  @IsBoolean()
  enhance_prompt?: boolean;
}
