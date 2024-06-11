import { Module } from '@nestjs/common';
import { ConnectService } from './connect.service';
import { ConnectController } from './connect.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nodes } from '@/nodes/models/nodes.model';
import { JwtModule } from '@nestjs/jwt';
import { NodesService } from '@/nodes/nodes.service';
import { ConfigModule } from '@nestjs/config';
import { HashingService } from '../../shared/hashing/hashing.service';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import jwtConfig from './config/jwt.config';
import { provideNodesRepository } from '@/nodes/repositories/nodes.repository.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nodes]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    ConnectService,
    NodesService,
    ...provideNodesRepository(),
  ],
  controllers: [ConnectController],
})
export class ConnectModule {}
