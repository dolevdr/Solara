import { IColumn } from '../../../shared/interfaces/column.interface';
import { FieldEnum } from '../../../shared/interfaces/field.enum';
import { StatusEnum } from '../../../shared/interfaces/status.enum';
import { Campaign } from '../../types/campaign.interface';

export const CAMPAIGN_TABLE_COLUMNS: IColumn[] = [
    {
        field: FieldEnum.NAME,
        name: 'Name',
        isSortable: true,
        style: { 'min-width': '150px' }
    },
    {
        field: FieldEnum.CONTENT_URL,
        name: 'Content',
        isSortable: false,
        style: { 'min-width': '150px' }
    },
    {
        field: FieldEnum.STATUS,
        name: 'Status',
        isSortable: false,
        style: { 'min-width': '120px' }
    },
    {
        field: FieldEnum.CREATED_AT,
        name: 'Created At',
        isSortable: true,
        style: { 'min-width': '150px' }
    },
    {
        field: FieldEnum.UPDATED_AT,
        name: 'Updated At',
        isSortable: true,
        style: { 'min-width': '150px' }
    }
];

export const STATUS_TO_COLOR: { [key in StatusEnum]: string } = {
    [StatusEnum.COMPLETED]: 'primary',
    [StatusEnum.PROCESSING]: 'accent',
    [StatusEnum.FAILED]: 'warn',
    [StatusEnum.PENDING]: 'default'
};

export const STATUS_CONTENT_CONFIG: { [key in StatusEnum]?: {
    url: string; alt: string; text: string;
} } = {
    [StatusEnum.PROCESSING]: {
        url: 'src/assets/images/process.png',
        alt: 'Processing',
        text: 'Processing...'
    },
    [StatusEnum.FAILED]: {
        url: 'assets/images/fail.png',
        alt: 'Failed',
        text: 'Failed'
    }
};

export const CAMPAIGN_PROPERTY_TO_FIELD: { [key in keyof Campaign]?: string } = {
    name: FieldEnum.NAME,
    createdAt: FieldEnum.CREATED_AT,
    updatedAt: FieldEnum.UPDATED_AT
};
