// Dependencies
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Interface
import { IFile } from 'src/file/domain/interface/file.interface';

// Enum
import { FormatEnum } from 'src/file/domain/enum/format.enum';

// Types
import { ID } from 'src/common/application/types/types.types';

@Entity({ name: 'tblFile' })
export class FileEntity implements IFile {
  constructor(dto?: Partial<IFile>) {
    this.file = dto?.file;
    this.format = dto?.format;
    this.sizeMB = dto?.sizeMB;
  }

  @PrimaryGeneratedColumn('uuid', { name: 'File_uuid' })
  id: ID;

  @Column({ name: 'File_base64File' })
  file: string;

  @Column({ name: 'File_enumFile', enum: FormatEnum, enumName: 'File_enumFile', nullable: true })
  format: FormatEnum;

  @DeleteDateColumn({ name: 'File_dateDeleteAt', type: 'timestamp with time zone' })
  deletedAt: Date;

  @Column({ name: 'File_floatSizeMB', type: 'float' })
  sizeMB: number;
}
