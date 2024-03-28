import { IUser } from 'src/auth/domain/interface/i-user';
import { StatusEnum } from '../enum/status.enum';
import { ID } from 'src/common/application/types/types.types';
import { FileEntity } from 'src/file/infrastructure/entities/file.entity';
import { IFile } from 'src/file/domain/interface/file.interface';

export interface IToDo {
  id: ID;
  title: string;
  description: string;
  status: StatusEnum;
  deadlineDate: Date;
  comments?: string;
  createdBy: Partial<IUser>;
  tags?: string[];
  file?: IFile;
}
