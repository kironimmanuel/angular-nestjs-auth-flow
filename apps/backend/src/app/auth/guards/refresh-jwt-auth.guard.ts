import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyKey } from '../../shared/enums';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard(StrategyKey.REFRESH) {}
