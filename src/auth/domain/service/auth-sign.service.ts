// Dependencies
import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';

// Repositories
import { UserRepository } from 'src/auth/infrastructure/repository/auth.repository';

// Interface
import { IUser } from '../interface/i-user';
import { UserEntity } from 'src/auth/infrastructure/entities/user.entity';
import { IAuthRepository } from '../irepositories/auth.repository.interface';

// DTO
import { SignUpDto } from 'src/auth/application/dto/sign-up.dto';
import { SignInDto } from 'src/auth/application/dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(@Inject(UserRepository) public readonly userRepository: IAuthRepository) {}

  public async createUser(dto: SignInDto): Promise<IUser> {
    let { password, username } = dto;

    username = username.toLocaleLowerCase();
    password = await this.hashPassword(password);

    const queryRunner = await this.userRepository.createAndStartTransaction();
    const userDto = new UserEntity({ username, password });

    try {
      const newUser = await this.userRepository.saveEntity(userDto, queryRunner);
      await this.userRepository.commitTransaction(queryRunner);
      return newUser;
    } catch (e) {
      await this.userRepository.rollbackTransaction(queryRunner);
      throw e;
    } finally {
      await this.userRepository.releaseTransaction(queryRunner);
    }
  }

  public async signUp(dto: SignUpDto): Promise<IUser> {
    const { password: passwordLogin, username } = dto;
    const userBD = await this.userRepository.findByUsername(username);
    const { password: passwordBD } = { ...userBD };

    return this.comparePassword(passwordLogin, passwordBD) && userBD;
  }

  private comparePassword(passwordLogin: string, passwordUser: string): boolean {
    return bcrypt.compareSync(passwordLogin || '', passwordUser || '');
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
