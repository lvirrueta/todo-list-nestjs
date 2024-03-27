/* eslint-disable @typescript-eslint/no-empty-interface */
import { IGenericRepository } from 'src/common/domain/irepositories/i-repository.repository.interface';
import { LogEntity } from 'src/common/infrastructure/entities/log.entity';

/**
 * @param E - Model Entity
 */
export interface ILogRepository extends IGenericRepository<LogEntity> {}
