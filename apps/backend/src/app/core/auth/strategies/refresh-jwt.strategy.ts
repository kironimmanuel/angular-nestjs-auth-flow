import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayloadDTO } from '@nx-angular-nestjs-authentication/models';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StrategyKey } from '../../../shared/enums';

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
        return { sub: payload.sub, username: payload.username, email: payload.email, role: payload.role };
    }
}
