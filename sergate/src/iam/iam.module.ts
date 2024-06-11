import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UtilsModule } from '../shared/utils/utils.module';
import { UsersModule } from '@/users/users.module';
import { NodesModule } from '@/nodes/nodes.module';
import { ConnectModule } from './connect/connect.module';
import { ChangePasswordModule } from './change-password/change-password.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';

@Module({
  imports: [
    LoginModule,
    ConnectModule,
    RegisterModule,
    UsersModule,
    NodesModule,
    ForgotPasswordModule,
    ChangePasswordModule,
    UtilsModule,
  ],
  providers: [JwtService],
})
export class IamModule {}
