import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayloadDTO } from '@nx-angular-nestjs-authentication/models';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StrategyKey } from '../../../shared/enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, StrategyKey.JWT) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayloadDTO): Promise<JwtPayloadDTO> {
        // Under the hood: req.user = payload
        return payload;
    }
}
