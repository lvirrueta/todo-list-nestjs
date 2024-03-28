// Dependencies
import { DataSource, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';

// Repository
import { GenericRepository } from 'src/common/infrastructure/generic.repository';

// IRepository
import { IToDoRepository } from 'src/todo-list/domain/irepositories/todo.repository.interface';

// Interface
import { ID } from 'src/common/application/types/types.types';
import { IUserStrategy } from 'src/auth/domain/interface/i-user.strategy';

// Entity
import { ToDoEntity } from '../entities/todo.entity';

@Injectable()
export class ToDoRepository extends GenericRepository<ToDoEntity> implements IToDoRepository {
  constructor(public readonly dataSource: DataSource) {
    super(ToDoEntity, dataSource);
  }

  public async findOneFile(id: ID, user: IUserStrategy, qr?: QueryRunner): Promise<ToDoEntity> {
    const { id: idUser } = user;
    const transaction = this.getSimpleOrTransaction(qr);

    const qb = transaction.createQueryBuilder('todo');

    qb.leftJoinAndSelect('todo.file', 'file');
    qb.where('todo.id = :id', { id });
    qb.andWhere('todo.createdBy = :idUser', { idUser });

    return await qb.getOne();
  }
}
