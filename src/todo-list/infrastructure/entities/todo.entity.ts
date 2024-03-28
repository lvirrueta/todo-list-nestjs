// Dependencies
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// Interface
import { IFile } from 'src/file/domain/interface/file.interface';
import { IToDo } from 'src/todo-list/domain/interface/todo.interface';

// Entity
import { UserEntity } from 'src/auth/infrastructure/entities/user.entity';
import { FileEntity } from 'src/file/infrastructure/entities/file.entity';

// Enum
import { StatusEnum } from 'src/todo-list/domain/enum/status.enum';

// Types
import { ID } from 'src/common/application/types/types.types';

@Entity({ name: 'tblToDo' })
export class ToDoEntity implements IToDo {
  constructor(dto?: Partial<IToDo>) {
    this.id = dto?.id;
    this.title = dto?.title;
    this.description = dto?.description;
    this.status = dto?.status;
    this.deadlineDate = dto?.deadlineDate;
    this.comments = dto?.comments;
    this.tags = dto?.tags;
  }

  @PrimaryGeneratedColumn('uuid', { name: 'ToDo_uuid' })
  id: ID;

  @Column({ name: 'ToDo_strTitle' })
  title: string;

  @Column({ name: 'ToDo_strDescription' })
  description: string;

  @Column({ name: 'ToDo_strStatus' })
  status: StatusEnum;

  @Column({ name: 'ToDo_dateDeadline', type: 'date' })
  deadlineDate: Date;

  @Column({ name: 'ToDo_strComments', nullable: true })
  comments?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'User_uuid' })
  createdBy: Partial<UserEntity>;

  @Column({ name: 'ToDo_strTags', nullable: true, type: 'json' })
  tags?: string[];

  // @Column({ name: 'ToDo_strFile', nullable: true })
  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: 'File_uuid' })
  file?: IFile;
}
