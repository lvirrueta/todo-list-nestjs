// Dependencies
import { Inject, Injectable } from '@nestjs/common';
import { ILogRepository } from '../irepositories/i-log.repository.interface';

// Repository
import { LogRepository } from 'src/common/infrastructure/log.repository';

// Interface
import { ILog } from '../interface/log.interface';

// Entity
import { LogEntity } from 'src/common/infrastructure/entities/log.entity';

@Injectable()
export class LogService {
  constructor(@Inject(LogRepository) public readonly logRepository: ILogRepository) {}

  public async createLog(dto: ILog): Promise<ILog> {
    dto = this.deletePassword(dto);
    dto = this.deleteFile(dto);
    const entity = new LogEntity(dto);
    return await this.logRepository.saveEntity(entity);
  }

  private deleteFile(dto: ILog): ILog {
    const { url } = dto;
    if (url.includes('todo')) {
      delete dto.body['file'];
    }
    return dto;
  }

  private deletePassword(dto: ILog): ILog {
    const { url } = dto;
    if (url.includes('auth')) {
      delete dto.body['password'];
    }
    return dto;
  }
}
