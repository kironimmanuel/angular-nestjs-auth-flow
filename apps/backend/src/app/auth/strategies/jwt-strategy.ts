import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StrategyKey } from '../../shared/enums';
import { JwtPayloadDTO } from '../dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, StrategyKey.JWT) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayloadDTO) {
    return { user: payload.username, email: payload.email };
  }
}
