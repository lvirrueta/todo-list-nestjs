// Dependencies
import { QueryRunner } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';

// Repository
import { FileRepository } from 'src/file/infrastructure/repository/file.repository';

// Interface
import { IFile } from '../interface/file.interface';
import { IFileRepository } from '../irepositories/file.repository.interface';

// Entity
import { FileEntity } from 'src/file/infrastructure/entities/file.entity';

// Enum
import { FormatEnum } from '../enum/format.enum';
import { ID } from 'src/common/application/types/types.types';

@Injectable()
export class FileService {
  constructor(@Inject(FileRepository) public readonly fileRepository: IFileRepository) {}

  public async createFile(file64: string, query?: QueryRunner): Promise<IFile> {
    const format = this.whichFormat(file64);

    const file: IFile = {
      id: undefined,
      deletedAt: undefined,
      file: file64,
      format,
      sizeMB: this.sizeFile(file64),
    };

    const fileE = new FileEntity(file);
    return await this.fileRepository.saveEntity(fileE, query);
  }

  public async getFile(id: ID): Promise<IFile> {
    return await this.fileRepository.findOneEntity(id);
  }

  public async updateFile(file: IFile, query: QueryRunner): Promise<IFile> {
    const { file: file64 } = file;
    file.format = this.whichFormat(file64);
    file.sizeMB = this.sizeFile(file64);
    return await this.fileRepository.updateEntity(file, query);
  }

  public async deleteFile(id: ID, query?: QueryRunner): Promise<IFile> {
    return await this.fileRepository.softDeleteEntity(id, query);
  }

  private sizeFile(file64: string): number {
    const buffer = Buffer.from(file64);
    const sizeMB = buffer.length / 1e6;
    return sizeMB;
  }

  private whichFormat(file64: string): FormatEnum {
    const format64 = file64.substring(0, 5).toUpperCase();

    const PNG_64 = 'IVBOR';
    const JPG_64 = '9J/4A';
    const PDF_64 = 'JVBER';

    switch (format64) {
      case PNG_64:
        return FormatEnum.PNG;

      case JPG_64:
        return FormatEnum.JPG;

      case PDF_64:
        return FormatEnum.PDF;

      default:
        return null;
        break;
    }
  }
}
