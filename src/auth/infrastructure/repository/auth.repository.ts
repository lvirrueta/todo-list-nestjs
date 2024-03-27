// Dependencies
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

// Repository
import { GenericRepository } from 'src/common/infrastructure/generic.repository';

// Interface
import { IAuthRepository } from 'src/auth/domain/irepositories/auth.repository.interface';

// Entities
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends GenericRepository<UserEntity> implements IAuthRepository {
  constructor(public readonly dataSource: DataSource) {
    super(UserEntity, dataSource);
  }
  public async findByUsername(username: string): Promise<UserEntity> {
    return await this.findOne({ where: { username } });
  }
}
