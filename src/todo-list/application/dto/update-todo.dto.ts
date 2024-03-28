import { IToDo } from 'src/todo-list/domain/interface/todo.interface';
import { CreateToDoDto } from './create-todo.dto';
import { ID } from 'src/common/application/types/types.types';
import { IUser } from 'src/auth/domain/interface/i-user';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/** Keys To Omit */
type OmitKeys = Pick<IToDo, 'id' | 'createdBy' | 'file'>;
type IToDoOmit = Omit<IToDo, keyof OmitKeys>;

export class UpdateToDoDto extends CreateToDoDto implements IToDoOmit {
  @ApiProperty({ description: '', example: '' })
  @IsString()
  id: ID;
}
