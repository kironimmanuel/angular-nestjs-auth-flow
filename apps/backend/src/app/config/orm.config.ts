import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  autoLoadEntities: true,
  synchronize: true,
};
