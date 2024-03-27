/* eslint-disable @typescript-eslint/no-empty-interface */
import { IGenericRepository } from 'src/common/domain/irepositories/i-repository.repository.interface';
import { ToDoEntity } from 'src/todo-list/infrastructure/entities/todo.entity';

/**
 * @param E - Model Entity
 */
export interface IToDoRepository extends IGenericRepository<ToDoEntity> {}
