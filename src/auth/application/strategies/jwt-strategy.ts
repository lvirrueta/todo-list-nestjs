// Imports
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, Logger } from '@nestjs/common';

// Repository
import { UserRepository } from 'src/auth/infrastructure/repository/auth.repository';

// IRepository
import { IAuthRepository } from 'src/auth/domain/irepositories/auth.repository.interface';

// Interface
import { IJwtPayload } from 'src/auth/domain/interface/i-jwt-payload';
import { IUserStrategy } from 'src/auth/domain/interface/i-user.strategy';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UserRepository) public readonly userRepository: IAuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.CONFIG_JWT_SECRET}`,
    });
  }

  public logger = new Logger(this.constructor.name);

  async validate(payload: IJwtPayload): Promise<IUserStrategy> {
    this.logger.log('validating...');
    const { userID } = payload;

    const user = await this.userRepository.findOneEntity(userID);

    if (!user) {
      this.logger.error('valid token, but user does not exists on db');
    }

    const userStrategy: IUserStrategy = {
      id: user.id,
      username: user.username,
    };

    this.logger.log('validation successful');
    this.logger.log('user strategy ->', userStrategy);
    return userStrategy;
  }
}
