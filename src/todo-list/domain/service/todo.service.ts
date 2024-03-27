// Dependencies
import { Inject, Injectable } from '@nestjs/common';

// Repository
import { ToDoRepository } from 'src/todo-list/infrastructure/repository/token.repository';

// Interface
import { IToDo } from '../interface/todo.interface';
import { ID } from 'src/common/application/types/types.types';
import { IToDoRepository } from '../irepositories/todo.repository.interface';

// DTO
import { CreateToDoDto } from 'src/todo-list/application/dto/create-todo.dto';
import { UpdateToDoDto } from 'src/todo-list/application/dto/update-todo.dto';
import { ToDoEntity } from 'src/todo-list/infrastructure/entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(@Inject(ToDoRepository) public readonly toDoRepository: IToDoRepository) {}

  public async getTodo(id: ID): Promise<IToDo> {
    return await this.toDoRepository.findOneEntity(id);
  }

  public async listTodo(): Promise<IToDo[]> {
    return await this.toDoRepository.listEntities();
  }

  public async createTodo(dto: CreateToDoDto): Promise<IToDo> {
    const entity = new ToDoEntity(dto);
    return await this.toDoRepository.saveEntity(entity);
  }

  public async updateTodo(dto: UpdateToDoDto): Promise<IToDo> {
    const entity = new ToDoEntity(dto);
    return await this.toDoRepository.updateEntity(entity);
  }

  public async deleteTodo(id: ID): Promise<IToDo> {
    return await this.toDoRepository.deleteEntity(id);
  }
}
