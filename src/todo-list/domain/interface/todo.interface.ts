import { IUser } from 'src/auth/domain/interface/i-user';
import { StatusEnum } from '../enum/status.enum';
import { ID } from 'src/common/application/types/types.types';

export interface IToDo {
  id: ID;
  title: string;
  description: string;
  status: StatusEnum;
  deadlineDate: Date;
  comments?: string;
  createdBy: Partial<IUser>;
  tags?: string[];
  file?: string;
}
