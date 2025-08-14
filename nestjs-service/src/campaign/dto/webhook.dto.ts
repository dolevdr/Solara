import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class WebhookDto {
    @ApiProperty({ description: 'Campaign ID (track_id)' })
    @IsString()
    track_id: string;

    @ApiProperty({ enum: ['success', 'error'], description: 'Generation status' })
    @IsEnum(['success', 'error'])
    status: 'success' | 'error';

    @ApiProperty({
        type: [String],
        description: 'Generated image URLs',
        required: false
    })
    @IsOptional()
    @IsArray()
    output?: string[];

    @ApiProperty({
        description: 'Error message if status is error',
        required: false
    })
    @IsOptional()
    @IsString()
    message?: string;

    @ApiProperty({
        description: 'Additional metadata',
        required: false
    })
    @IsOptional()
    meta?: any;
}
