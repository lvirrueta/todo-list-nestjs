import { Module } from '@nestjs/common';
import { ToDoController } from './application/controller/todo.controller';
import { TodoService } from './domain/service/todo.service';
import { ToDoRepository } from './infrastructure/repository/token.repository';

@Module({
  controllers: [ToDoController],
  providers: [TodoService, ToDoRepository],
})
export class ToDoListModule {}
