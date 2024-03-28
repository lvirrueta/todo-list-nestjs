/* eslint-disable @typescript-eslint/no-empty-interface */
import { IGenericRepository } from 'src/common/domain/irepositories/i-repository.repository.interface';
import { FileEntity } from 'src/file/infrastructure/entities/file.entity';

/**
 * @param E - Model Entity
 */
export interface IFileRepository extends IGenericRepository<FileEntity> {}
