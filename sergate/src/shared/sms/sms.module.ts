import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
