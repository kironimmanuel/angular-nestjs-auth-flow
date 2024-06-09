import { JwtPayloadDTO, LoginUserDTO } from '@nx-angular-nestjs-authentication/models';

export class JwtPayloadFactory {
    static create(user: LoginUserDTO): JwtPayloadDTO {
        return {
            sub: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };
    }
}
