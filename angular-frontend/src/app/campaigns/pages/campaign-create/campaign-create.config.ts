import { CampaignType } from '../../types/campaign.interface';

export const maxPromptLength = 70;
export const campaignTypes = [
    { value: CampaignType.TEXT, label: 'Text' },
    { value: CampaignType.IMAGE, label: 'Image' }
];
