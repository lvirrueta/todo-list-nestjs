// Dependencies
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

// Repository
import { GenericRepository } from 'src/common/infrastructure/generic.repository';

// IRepository
import { IToDoRepository } from 'src/todo-list/domain/irepositories/todo.repository.interface';

// Entity
import { ToDoEntity } from '../entities/todo.entity';

@Injectable()
export class ToDoRepository extends GenericRepository<ToDoEntity> implements IToDoRepository {
  constructor(public readonly dataSource: DataSource) {
    super(ToDoEntity, dataSource);
  }
}
