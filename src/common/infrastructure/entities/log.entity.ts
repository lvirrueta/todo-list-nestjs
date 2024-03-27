import { ID } from 'src/common/application/types/types.types';
import { ILog } from 'src/common/domain/interface/log.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblLogs' })
export class LogEntity implements ILog {
  constructor(dto: Partial<ILog>) {
    this.url = dto?.url;
    this.user = dto?.user;
    this.body = dto?.body;
    this.response = dto?.response;
    this.createdAt = dto?.createdAt;
    this.timeResponse = dto?.timeResponse;
    this.method = dto?.method;
  }

  @PrimaryGeneratedColumn('uuid', { name: 'Log_uuid' })
  id: ID;

  @Column({ name: 'Log_strUrl' })
  url: string;

  @Column({ name: 'Log_uuidUserID', type: 'varchar', nullable: true })
  user: ID;

  @Column({ name: 'Log_strBody', type: 'json', nullable: true })
  body: JSON;

  @Column({ name: 'Log_strResponse', type: 'json', nullable: true })
  response: JSON;

  @Column({ name: 'Log_strMethod', nullable: true })
  method: string;

  @Column({ name: 'Log_intTimeResponse', type: 'json', nullable: true })
  timeResponse: number;

  @Column({ name: 'Log_date', type: 'timestamp with time zone' })
  createdAt: Date;
}
