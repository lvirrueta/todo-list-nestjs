import { Module } from '@nestjs/common';
import { ToDoController } from './application/controller/todo.controller';
import { TodoService } from './domain/service/todo.service';
import { ToDoRepository } from './infrastructure/repository/todo.repository';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [FileModule],
  controllers: [ToDoController],
  providers: [TodoService, ToDoRepository],
})
export class ToDoListModule {}
