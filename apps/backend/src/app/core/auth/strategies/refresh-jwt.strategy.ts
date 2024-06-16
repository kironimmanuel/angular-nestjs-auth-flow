import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayloadDTO } from '@nx-angular-nestjs-authentication/models';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StrategyKey } from '../../../shared/enums';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, StrategyKey.REFRESH) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(payload: JwtPayloadDTO): Promise<JwtPayloadDTO> {
        return payload;
    }
}
