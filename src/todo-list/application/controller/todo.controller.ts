// Dependencies
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// Services
import { TodoService } from 'src/todo-list/domain/service/todo.service';

// Interface
import { IToDo } from 'src/todo-list/domain/interface/todo.interface';

// DTO
import { CreateToDoDto } from '../dto/create-todo.dto';
import { UpdateToDoDto } from '../dto/update-todo.dto';

// Constants
import { Routes } from 'src/common/application/routes/routes.constants';
import { ID } from 'src/common/application/types/types.types';

@ApiTags(Routes.ToDo.ApiTags)
@Controller(Routes.ToDo.Controller)
export class ToDoController {
  constructor(private readonly toDoService: TodoService) {}

  @Get(Routes.ToDo.Detail)
  @ApiOperation({ summary: 'Get the detail of a todo', description: '' })
  async detail(@Param('id') id: string): Promise<IToDo> {
    return await this.toDoService.getTodo(id);
  }

  @Get(Routes.ToDo.List)
  @ApiOperation({ summary: 'list of a todo', description: '' })
  async list(): Promise<IToDo[]> {
    return await this.toDoService.listTodo();
  }

  @Post(Routes.ToDo.Create)
  @ApiOperation({ summary: 'Get the detail of a todo', description: '' })
  async create(@Body() dto: CreateToDoDto): Promise<IToDo> {
    return await this.toDoService.createTodo(dto);
  }

  @Put(Routes.ToDo.Create)
  @ApiOperation({ summary: 'Get the detail of a todo', description: '' })
  async update(@Body() dto: UpdateToDoDto): Promise<IToDo> {
    return await this.toDoService.createTodo(dto);
  }

  @Delete(Routes.ToDo.Create)
  @ApiOperation({ summary: 'Get the detail of a todo', description: '' })
  async delete(id: ID): Promise<IToDo> {
    return await this.toDoService.deleteTodo(id);
  }
}
