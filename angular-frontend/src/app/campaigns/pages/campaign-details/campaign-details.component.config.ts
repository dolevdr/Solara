import { StatusEnum } from "../../../shared/interfaces/status.enum";

export const STATUS_TO_ICON = {
  [StatusEnum.PENDING]: 'schedule',
  [StatusEnum.PROCESSING]: 'sync',
  [StatusEnum.COMPLETED]: 'check_circle',
  [StatusEnum.FAILED]: 'error'
};