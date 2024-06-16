import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyKey } from '../../../shared/enums';
import { TokenExpiredException } from '../../../shared/exceptions/token-expired.exception';
import { TokenMalformedException } from '../../../shared/exceptions/token-malformed.exception';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard(StrategyKey.REFRESH) {
    // Override the handleRequest method to customize exception handling
    handleRequest(err: Error, user: any, info: any) {
        if (info?.name === 'TokenExpiredError') {
            throw new TokenExpiredException('Refresh token has expired');
        }

        if (info || err || !user) {
            throw err || new TokenMalformedException('Token is malformed or missing');
        }

        return user;
    }
}
