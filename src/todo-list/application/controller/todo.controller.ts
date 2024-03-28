// Dependencies
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// Services
import { TodoService } from 'src/todo-list/domain/service/todo.service';

// Interface
import { IToDo } from 'src/todo-list/domain/interface/todo.interface';
import { IUserStrategy } from 'src/auth/domain/interface/i-user.strategy';
import { ISearchOpt } from 'src/common/domain/interface/search.interface';
import { IListAndCount } from 'src/common/domain/interface/list-and-count.interface';

// DTO
import { CreateToDoDto } from '../dto/create-todo.dto';
import { UpdateToDoDto } from '../dto/update-todo.dto';

// Constants
import { Routes } from 'src/common/application/routes/routes.constants';
import { GetUser } from 'src/auth/application/decorators/get-user.decorator';

@ApiTags(Routes.ToDo.ApiTags)
@Controller(Routes.ToDo.Controller)
export class ToDoController {
  constructor(private readonly toDoService: TodoService) {}

  @Get(Routes.ToDo.Detail)
  @ApiOperation({ summary: 'Get the detail of a todo', description: '' })
  async detail(@Param('id') id: string, @GetUser() user: IUserStrategy): Promise<IToDo> {
    return await this.toDoService.getTodo(id, user);
  }

  @Get(Routes.ToDo.Search)
  @ApiOperation({ summary: 'list of a todo', description: '' })
  async list(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('value') value: string,
    @GetUser() user: IUserStrategy,
  ): Promise<IListAndCount<IToDo>> {
    const opt: ISearchOpt = {
      limit,
      offset,
      value,
    };

    return await this.toDoService.listTodo(opt, user);
  }

  @Post(Routes.ToDo.Create)
  @ApiOperation({ summary: 'Create a todo', description: '' })
  async create(@Body() dto: CreateToDoDto, @GetUser() user: IUserStrategy): Promise<IToDo> {
    return await this.toDoService.createTodo(dto, user);
  }

  @Put(Routes.ToDo.Update)
  @ApiOperation({ summary: 'update a todo', description: '' })
  async update(@Body() dto: UpdateToDoDto, @GetUser() user: IUserStrategy): Promise<IToDo> {
    return await this.toDoService.updateTodo(dto, user);
  }

  @Delete(Routes.ToDo.Delete)
  @ApiOperation({ summary: 'Delete a todo', description: '' })
  async delete(@Param('id') id: string, @GetUser() user: IUserStrategy): Promise<IToDo> {
    return await this.toDoService.deleteTodo(id, user);
  }
}
