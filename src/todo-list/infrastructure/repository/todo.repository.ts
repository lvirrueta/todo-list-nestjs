// Dependencies
import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, QueryRunner } from 'typeorm';

// Repository
import { GenericRepository } from 'src/common/infrastructure/generic.repository';

// IRepository
import { IToDoRepository } from 'src/todo-list/domain/irepositories/todo.repository.interface';

// Interface
import { ID } from 'src/common/application/types/types.types';
import { ISearchOpt } from 'src/common/domain/interface/search.interface';
import { IUserStrategy } from 'src/auth/domain/interface/i-user.strategy';

// Entity
import { ToDoEntity } from '../entities/todo.entity';

@Injectable()
export class ToDoRepository extends GenericRepository<ToDoEntity> implements IToDoRepository {
  constructor(public readonly dataSource: DataSource) {
    super(ToDoEntity, dataSource);
  }

  public async listToDoAndCount(serchOpt: ISearchOpt, user: IUserStrategy, qr?: QueryRunner): Promise<[ToDoEntity[], number]> {
    const { id: idUser } = user;
    const { limit, offset, value } = { ...serchOpt };

    const transaction = this.getSimpleOrTransaction(qr);
    const qb = transaction.createQueryBuilder('todo');

    qb.leftJoinAndSelect('todo.file', 'file');

    qb.andWhere(
      new Brackets((nqb) => {
        const val = value.split(' ').filter((s) => s.length);

        val.forEach((val) => {
          const v = val.toLowerCase();
          nqb.where(`todo.title ilike '%${v}%'`);
          nqb.orWhere(`todo.tags @> '["${v}"]'`);
          nqb.orWhere('todo.status = :v', { v });
          nqb.orWhere('file.format = :v', { v });

          const days = parseInt(v);
          if (days) {
            nqb.orWhere('todo.deadlineDate - current_date = :v::integer', { v });
          }
        });
      }),
    );

    qb.andWhere('todo.createdBy = :idUser', { idUser });
    qb.limit(limit);
    qb.offset(offset);

    return await qb.getManyAndCount();
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
