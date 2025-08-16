import { CampaignType } from '@prisma/client';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @MaxLength(255)
  name: string;

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
