import { FieldEnum } from './field.enum';

export interface IColumn {
    field: FieldEnum;
    name: string;
    isSortable: boolean;
    style?: any;
}
