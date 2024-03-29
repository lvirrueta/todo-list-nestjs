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

// Constants
import { ThrowError } from 'src/common/application/utils/throw-error';
import { Errors } from 'src/common/application/error/error.constants';

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
    dto = this.lowerCaseTags(dto);

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
      throw error;
    } finally {
      await this.toDoRepository.releaseTransaction(transaction);
    }
  }

  public async updateTodo(dto: UpdateToDoDto, userSt: IUserStrategy): Promise<IToDo> {
    const { id, file } = dto;
    dto = this.lowerCaseTags(dto);

    const entity = await this.getTodo(id, userSt);
    if (!entity) ThrowError.httpException(Errors.GenericRepository.UpdateEntity);

    const entityFile = await this.fileService.getFile(entity.file?.id);
    if (entityFile) entityFile.file = file;

    const transaction = await this.toDoRepository.createAndStartTransaction();
    try {
      const user = new UserEntity();
      user.id = userSt.id;
      entity.createdBy = user;

      const todo = new ToDoEntity({ ...dto, file: null });
      todo.file = entityFile;

      const entityU = await this.toDoRepository.updateEntity(todo);
      if (entityFile) {
        await this.fileService.updateFile(entityFile, transaction);
      }

      if (file.length) {
        await this.fileService.createFile(file, transaction);
      }

      await this.toDoRepository.commitTransaction(transaction);
      return entityU;
    } catch (error) {
      await this.toDoRepository.rollbackTransaction(transaction);
      throw error;
    } finally {
      await this.toDoRepository.releaseTransaction(transaction);
    }
  }

  public async deleteTodo(id: ID, user: IUserStrategy): Promise<IToDo> {
    const entity = await this.getTodo(id, user);
    if (!entity) ThrowError.httpException(Errors.GenericRepository.DeleteEntity);

    const file = entity.file;
    const transaction = await this.toDoRepository.createAndStartTransaction();
    try {
      await this.fileService.deleteFile(file.id, transaction);
      const entityDel = await this.toDoRepository.deleteEntity(id, transaction);
      await this.toDoRepository.commitTransaction(transaction);
      return entityDel;
    } catch (error) {
      await this.toDoRepository.rollbackTransaction(transaction);
      throw error;
    } finally {
      await this.toDoRepository.releaseTransaction(transaction);
    }
  }

  private lowerCaseTags<T extends CreateToDoDto>(dto: T): T {
    dto.tags = dto.tags?.map((t) => t.toLowerCase());
    return dto;
  }
}
