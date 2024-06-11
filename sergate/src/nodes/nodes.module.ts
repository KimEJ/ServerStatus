import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { NodesController } from './nodes.controller';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nodes } from './models/nodes.model';
import { provideNodesRepository } from './repositories/nodes.repository.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Nodes])],
  controllers: [NodesController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    NodesService,
    ...provideNodesRepository(),
  ],
})
export class NodesModule {}
