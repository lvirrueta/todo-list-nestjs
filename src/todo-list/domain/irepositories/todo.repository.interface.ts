/* eslint-disable @typescript-eslint/no-empty-interface */
import { IUserStrategy } from 'src/auth/domain/interface/i-user.strategy';
import { ID } from 'src/common/application/types/types.types';
import { IGenericRepository } from 'src/common/domain/irepositories/i-repository.repository.interface';
import { ToDoEntity } from 'src/todo-list/infrastructure/entities/todo.entity';
import { QueryRunner } from 'typeorm';

/**
 * @param E - Model Entity
 */
export interface IToDoRepository extends IGenericRepository<ToDoEntity> {
  findOneFile(id: ID, user: IUserStrategy, qr?: QueryRunner): Promise<ToDoEntity>;
  listToDoAndCount(serchOpt, user: IUserStrategy, qr?: QueryRunner): Promise<[ToDoEntity[], number]>;
}
