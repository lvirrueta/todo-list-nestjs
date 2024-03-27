// Dependencies
import { Inject, Injectable } from '@nestjs/common';

// Repository
import { ToDoRepository } from 'src/todo-list/infrastructure/repository/todo.repository';

// Interface
import { IToDo } from '../interface/todo.interface';
import { ID } from 'src/common/application/types/types.types';
import { IUserStrategy } from 'src/auth/domain/interface/i-user.strategy';
import { IToDoRepository } from '../irepositories/todo.repository.interface';

// Entity
import { UserEntity } from 'src/auth/infrastructure/entities/user.entity';
import { ToDoEntity } from 'src/todo-list/infrastructure/entities/todo.entity';

// DTO
import { CreateToDoDto } from 'src/todo-list/application/dto/create-todo.dto';
import { UpdateToDoDto } from 'src/todo-list/application/dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(@Inject(ToDoRepository) public readonly toDoRepository: IToDoRepository) {}

  public async getTodo(id: ID, userSt: IUserStrategy): Promise<IToDo> {
    return await this.toDoRepository.findOneEntity(id, { where: { createdBy: { id: userSt.id } } });
  }

  public async listTodo(userSt: IUserStrategy): Promise<IToDo[]> {
    return await this.toDoRepository.listEntities({ where: { createdBy: { id: userSt.id } } });
  }

  public async createTodo(dto: CreateToDoDto, userSt: IUserStrategy): Promise<IToDo> {
    const entity = new ToDoEntity(dto);
    const user = new UserEntity();
    user.id = userSt.id;
    entity.createdBy = user;
    return await this.toDoRepository.saveEntity(entity);
  }

  public async updateTodo(dto: UpdateToDoDto, userSt: IUserStrategy): Promise<IToDo> {
    const { id } = dto;
    const entity = await this.getTodo(id, userSt);
    if (!entity) return;
    const user = new UserEntity();
    user.id = userSt.id;
    entity.createdBy = user;
    return await this.toDoRepository.updateEntity(entity);
  }

  public async deleteTodo(id: ID, user: IUserStrategy): Promise<IToDo> {
    const entity = await this.getTodo(id, user);
    if (!entity) return;
    return await this.toDoRepository.deleteEntity(id);
  }
}
