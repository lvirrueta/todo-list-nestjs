import { FormatEnum } from '../enum/format.enum';
import { ID } from 'src/common/application/types/types.types';

export interface IFile {
  id: ID;
  file: string;
  format: FormatEnum;
  deletedAt: Date;
  sizeMB: number;
}
