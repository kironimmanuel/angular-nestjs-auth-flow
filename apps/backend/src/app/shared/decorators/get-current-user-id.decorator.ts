import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadDTO } from '@nx-angular-nestjs-authentication/models';

export const GetCurrentUserId = createParamDecorator((_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayloadDTO;
    return user.sub;
});
