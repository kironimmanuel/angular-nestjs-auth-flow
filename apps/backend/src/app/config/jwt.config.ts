import { JwtModuleOptions } from '@nestjs/jwt';
import { environment } from '@nx-angular-nestjs-authentication/environments';

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
  // 15 minutes
  signOptions: { expiresIn: environment.accessTokenLifetime },
};
