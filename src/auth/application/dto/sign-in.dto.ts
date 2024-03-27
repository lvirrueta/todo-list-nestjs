import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IUser } from 'src/auth/domain/interface/i-user';

export class SignInDto implements IUser {
  @ApiProperty({ description: 'username of the user', example: 'admin' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'password of user', example: 'admin1234' })
  @IsString()
  password: string;
}
