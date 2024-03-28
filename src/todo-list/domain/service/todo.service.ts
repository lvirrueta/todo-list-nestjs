// Dependencies
import { Inject, Injectable } from '@nestjs/common';

// Service
import { FileService } from 'src/file/domain/service/file.service';

// Repository
import { ToDoRepository } from 'src/todo-list/infrastructure/repository/todo.repository';

// Interface
import { IToDo } from '../interface/todo.interface';
import { ID } from 'src/common/application/types/types.types';
import { ISearchOpt } from 'src/common/domain/interface/search.interface';
import { IUserStrategy } from 'src/auth/domain/interface/i-user.strategy';
import { IToDoRepository } from '../irepositories/todo.repository.interface';
import { IListAndCount } from 'src/common/domain/interface/list-and-count.interface';

// Entity
import { UserEntity } from 'src/auth/infrastructure/entities/user.entity';
import { ToDoEntity } from 'src/todo-list/infrastructure/entities/todo.entity';

// DTO
import { CreateToDoDto } from 'src/todo-list/application/dto/create-todo.dto';
import { UpdateToDoDto } from 'src/todo-list/application/dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @Inject(ToDoRepository) public readonly toDoRepository: IToDoRepository,
    @Inject(FileService) public readonly fileService: FileService,
  ) {}

  public async getTodo(id: ID, userSt: IUserStrategy): Promise<IToDo> {
    return await this.toDoRepository.findOneFile(id, userSt);
  }

  public async listTodo(opt: ISearchOpt, userSt: IUserStrategy): Promise<IListAndCount<IToDo>> {
    const [results, total] = await this.toDoRepository.listToDoAndCount(opt, userSt);
    return { results, total };
  }

  public async createTodo(dto: CreateToDoDto, userSt: IUserStrategy): Promise<IToDo> {
    const { file } = dto;

    const transaction = await this.toDoRepository.createAndStartTransaction();
    try {
      const newFile = await this.fileService.createFile(file, transaction);
      const entity = new ToDoEntity({ ...dto, file: newFile });
      const user = new UserEntity();
      user.id = userSt.id;
      entity.createdBy = user;
      entity.file = newFile;

      const newTodo = await this.toDoRepository.saveEntity(entity, transaction);
      await this.toDoRepository.commitTransaction(transaction);
      return newTodo;
    } catch (error) {
      await this.toDoRepository.rollbackTransaction(transaction);
    } finally {
      await this.toDoRepository.releaseTransaction(transaction);
    }
  }

  public async updateTodo(dto: UpdateToDoDto, userSt: IUserStrategy): Promise<IToDo> {
    const { id, file } = dto;
    const entity = await this.getTodo(id, userSt);
    if (!entity) return;

    const entityFile = await this.fileService.getFile(entity.file?.id);
    if (entityFile) entityFile.file = file;

    const transaction = await this.toDoRepository.createAndStartTransaction();
    try {
      const user = new UserEntity();
      user.id = userSt.id;
      entity.createdBy = user;
      const entityU = await this.toDoRepository.updateEntity(entity);
      await this.fileService.updateFile(entityFile, transaction);
      await this.toDoRepository.commitTransaction(transaction);
      return entityU;
    } catch (error) {
      await this.toDoRepository.rollbackTransaction(transaction);
    } finally {
      await this.toDoRepository.releaseTransaction(transaction);
    }

    return await this.toDoRepository.updateEntity(entity);
  }

  public async deleteTodo(id: ID, user: IUserStrategy): Promise<IToDo> {
    const entity = await this.getTodo(id, user);
    if (!entity) return;

    const file = entity.file;
    const transaction = await this.toDoRepository.createAndStartTransaction();
    try {
      await this.fileService.deleteFile(file.id, transaction);
      const entityDel = await this.toDoRepository.deleteEntity(id, transaction);
      await this.toDoRepository.commitTransaction(transaction);
      return entityDel;
    } catch (error) {
      await this.toDoRepository.rollbackTransaction(transaction);
      await this.toDoRepository.rollbackTransaction(transaction);
    } finally {
      await this.toDoRepository.releaseTransaction(transaction);
    }
  }
}
