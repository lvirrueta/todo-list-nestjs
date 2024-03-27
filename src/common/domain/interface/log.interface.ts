import { ID } from 'src/common/application/types/types.types';

export interface ILog {
  id: ID;
  url: string;
  user: ID;
  body: JSON;
  response: JSON;
  method: string;
  timeResponse: number;
  createdAt: Date;
}
