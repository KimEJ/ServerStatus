import { Injectable, Logger } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Sms } from './sms.type';

@Injectable()
export class SmsService {
  private from: string = this.configService.get<string>('SMS_NUMBER');
  private httpService: HttpService = new HttpService();

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.httpService.axiosRef.defaults.baseURL = this.configService.get<string>('SMS_BASE_URL');
    this.httpService.axiosRef.defaults.headers.common['CL_AUTH_KEY'] = this.configService.get<string>('SMS_API_KEY');
  }

  async send(url: string, body: FormData) {
    try {
      const { data } = await firstValueFrom(this.httpService.post(url, body)) as { data: Sms };

      Logger.log(data);
      if (data.data.success != 1) {
        throw new Error(`SMS can not sent: ${data.data.error}`);
      } else if (data.api.success === false) {
        throw new Error('SMS can not sent: API error');
      }
      return data;

    } catch (error) {
      if (error instanceof AxiosError)
        Logger.error(error.response.data);
      else if (error instanceof Error)
        Logger.error(error.message);
      else
        Logger.error(error);
      throw new Error('SMS can not sent');
    }
  }

  async sendSms(to: Array<string>, text: string) {
    to.forEach(number => {
      const body: FormData = new FormData();
      body.append('from', this.from);

      let url = "/send_sms";
      body.append('to', number);
      body.append('text', text);
      console.log("data: ", body);

      // 5분 간격으로 3번까지 재시도
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          this.send(url, body);
        }, 300000 * i);
      }
    });
  }
}
