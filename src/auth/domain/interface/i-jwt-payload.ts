import { ID } from 'src/common/application/types/types.types';

export interface IJwtPayload {
  userID: ID;
  jti: ID;
}
