import { Module } from '@nestjs/common';
import { DatasService } from './datas.service';
import { NodesService } from '@/nodes/nodes.service';
import { DatasController } from './datas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Datas } from './models/datas.model';
import { provideDatasRepository } from './repositories/datas.repository.provider';
import { provideNodesRepository } from '@/nodes/repositories/nodes.repository.provider';

import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '@/shared/hashing/bcrypt.service';
import { HashingService } from '@/shared/hashing/hashing.service';
import { Nodes } from '@/nodes/models/nodes.model';
import { Users } from '@/users/models/users.model';
import { UsersService } from '@/users/users.service';
import { provideUsersRepository } from '@/users/repositories/users.repository.provider';
import { SmsModule } from '@/shared/sms/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nodes]),
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([Datas]),
    SmsModule,
  ],
  controllers: [DatasController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    DatasService,
    NodesService,
    UsersService,
    JwtService,
    ...provideDatasRepository(),
    ...provideNodesRepository(),
    ...provideUsersRepository(),
  ],
})
export class DatasModule {}
