// Dependencies
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

// Repository
import { GenericRepository } from 'src/common/infrastructure/generic.repository';

// IRepository
import { IFileRepository } from 'src/file/domain/irepositories/file.repository.interface';

// Entity
import { FileEntity } from '../entities/file.entity';

@Injectable()
export class FileRepository extends GenericRepository<FileEntity> implements IFileRepository {
  constructor(public readonly dataSource: DataSource) {
    super(FileEntity, dataSource);
  }
}
