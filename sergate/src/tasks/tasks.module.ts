import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { provideNodesRepository } from '@/nodes/repositories/nodes.repository.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nodes } from '@/nodes/models/nodes.model';
import { BcryptService } from '@/shared/hashing/bcrypt.service';
import { HashingService } from '@/shared/hashing/hashing.service';
import { Users } from '@/users/models/users.model';
import { provideUsersRepository } from '@/users/repositories/users.repository.provider';
import { UsersService } from '@/users/users.service';
import { SmsModule } from '@/shared/sms/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nodes]),
    TypeOrmModule.forFeature([Users]),
    SmsModule,
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    TasksService,
    UsersService,
    ...provideNodesRepository(),
    ...provideUsersRepository(),
  ],
})
export class TasksModule { }