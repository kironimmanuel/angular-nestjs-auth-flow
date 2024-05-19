import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyKey } from '../../shared/enums';

@Injectable()
export class LocalAuthGuard extends AuthGuard(StrategyKey.LOCAL) {}
