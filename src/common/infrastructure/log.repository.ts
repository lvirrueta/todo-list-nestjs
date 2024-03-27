// Dependencies
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

// Repository
import { GenericRepository } from 'src/common/infrastructure/generic.repository';

// Interface
import { ILogRepository } from '../domain/irepositories/i-log.repository.interface';

// Entities
import { LogEntity } from './entities/log.entity';

@Injectable()
export class LogRepository extends GenericRepository<LogEntity> implements ILogRepository {
  constructor(public readonly dataSource: DataSource) {
    super(LogEntity, dataSource);
  }
}
