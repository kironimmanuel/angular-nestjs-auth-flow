import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StrategyKey } from '../../shared/enums';
import { JwtPayloadDTO } from '../dto';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, StrategyKey.REFRESH) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayloadDTO) {
    return { user: payload.username, email: payload.email };
  }
}
