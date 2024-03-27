/* eslint-disable @typescript-eslint/no-empty-interface */
import { UserEntity } from 'src/auth/infrastructure/entities/user.entity';
import { IGenericRepository } from 'src/common/domain/irepositories/i-repository.repository.interface';

/**
 * @param E - Model Entity
 */
export interface IAuthRepository extends IGenericRepository<UserEntity> {
  findByUsername(username: string): Promise<UserEntity>;
}
