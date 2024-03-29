// Dependencies
import * as ms from 'ms';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';

// Repositories
import { UserRepository } from 'src/auth/infrastructure/repository/auth.repository';

// Interface
import { IJwtPayload } from '../interface/i-jwt-payload';
import { IAccessToken } from '../interface/i-access-token';
import { ID } from 'src/common/application/types/types.types';
import { UserEntity } from 'src/auth/infrastructure/entities/user.entity';
import { IAuthRepository } from '../irepositories/auth.repository.interface';

// DTO
import { SignUpDto } from 'src/auth/application/dto/sign-up.dto';
import { SignInDto } from 'src/auth/application/dto/sign-in.dto';

// Constants
import { ThrowError } from 'src/common/application/utils/throw-error';
import { Errors } from 'src/common/application/error/error.constants';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, @Inject(UserRepository) public readonly userRepository: IAuthRepository) {}

  /** Register to the application */
  public async createUser(dto: SignInDto): Promise<IAccessToken> {
    let { password, username } = dto;

    username = username.toLocaleLowerCase();
    password = await this.hashPassword(password);

    const queryRunner = await this.userRepository.createAndStartTransaction();
    const userDto = new UserEntity({ username, password });

    try {
      const newUser = await this.userRepository.saveEntity(userDto, queryRunner);
      await this.userRepository.commitTransaction(queryRunner);
      return await this.generateJwtToken(newUser.id);
    } catch (e) {
      await this.userRepository.rollbackTransaction(queryRunner);
      if (e?.code === '23505') {
        ThrowError.httpException(Errors.Auth.UserRegistered);
      }
      throw e;
    } finally {
      await this.userRepository.releaseTransaction(queryRunner);
    }
  }

  /** Login and get JWT Token */
  public async signUp(dto: SignUpDto): Promise<IAccessToken> {
    const { password: passwordLogin, username } = dto;
    const userBD = await this.userRepository.findByUsername(username);
    const { password: passwordBD } = { ...userBD };

    if (this.comparePassword(passwordLogin, passwordBD) && userBD) {
      return await this.generateJwtToken(userBD.id);
    }

    ThrowError.httpException(Errors.Auth.IncorrectCredentials);
  }

  /** Compare Password login with password hashed in the DB */
  private comparePassword(passwordLogin: string, passwordUser: string): boolean {
    return bcrypt.compareSync(passwordLogin || '', passwordUser || '');
  }

  /** Hash Password */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  /** Generate JWT Token */
  private async generateJwtToken(userID: ID): Promise<IAccessToken> {
    const idToken = uuidv4();

    const payload: IJwtPayload = {
      userID,
      jti: idToken,
    };

    const msTokenExpire = '1h';
    const msRefreshTokenExpire = '2h';

    const accessToken = this.jwtService.sign(payload, { expiresIn: ms(msTokenExpire) });
    const refreshToken = this.jwtService.sign({ jti: idToken }, { expiresIn: ms(msRefreshTokenExpire) });

    return {
      accessToken,
      refreshToken,
    };
  }
}
