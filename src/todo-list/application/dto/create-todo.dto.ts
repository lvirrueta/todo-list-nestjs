import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsString } from 'class-validator';
import { ID } from 'src/common/application/types/types.types';
import { StatusEnum } from 'src/todo-list/domain/enum/status.enum';
import { IToDo } from 'src/todo-list/domain/interface/todo.interface';

/** Keys To Omit */
type OmitKeys = Pick<IToDo, 'id' | 'createdBy'>;
type IToDoOmit = Omit<IToDo, keyof OmitKeys>;

export class CreateToDoDto implements IToDoOmit {
  @ApiProperty({ description: 'Titulo de la tarea', example: 'Comprar Aceite' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descripción de la tarea', example: 'Comprar aceite para el servicio del auto' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Estatus de la tarea', example: StatusEnum.PENDING, enum: StatusEnum })
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty({ description: 'Fecha limite para la tarea', example: '2024-03-30' })
  @IsDateString()
  deadlineDate: Date;

  @ApiProperty({ description: 'Descripción de la tarea', example: 'Comprar aceite 5w30' })
  @IsString()
  comments?: string;

  // @ApiProperty({ description: 'ID del usuario', example: '167a81f5-001b-4905-b56e-bc7c6f7c33f5' })
  // @IsString()
  // createdBy: ID;

  @ApiProperty({ description: 'Agregar tags a la tarea', example: ['Servicio', 'Aceite', 'Auto'] })
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: '', example: '' })
  @IsString()
  file?: string;
}
