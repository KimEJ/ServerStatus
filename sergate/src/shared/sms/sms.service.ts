import { Injectable, Logger } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Sms } from './sms.type';

@Injectable()
export class SmsService {
  private data: FormData = new FormData();
  private httpService: HttpService = new HttpService();

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.httpService.axiosRef.defaults.baseURL = this.configService.get<string>('SMS_BASE_URL');
    this.httpService.axiosRef.defaults.headers.common['CL_AUTH_KEY'] = this.configService.get<string>('SMS_API_KEY');
    this.data.append('from', this.configService.get<string>('SMS_NUMBER'));
  }

  async sendSms(to: Array<string>, text: string) {
    let url = "/send_sms_multi";
    if(to.length === 1) {
      this.data.append('to', to[0]);
      url = "/send_sms";
    } else{
      this.data.append('to_list', '["' + to.join('", "') + '"]');
    }
    this.data.append('text', text);
    console.log("data: ", this.data);

    try {
      const { data } = await firstValueFrom(this.httpService.post(url, this.data)) as { data: Sms };
    
      Logger.log(data);
      if(data.data.success != 1) {
        throw new Error(`SMS can not sent: ${data.data.error}`);
      } else if(data.api.success === false) {
        throw new Error('SMS can not sent: API error');
      } else {
        data.data.result.forEach(result => {
          if(result.success != 1) {
            throw new Error(`SMS can not sent: ${result.error}`);
          }
        });
      }
      return data;
      
    } catch (error) {
      if(error instanceof AxiosError)
        Logger.error(error.response.data);
      else if(error instanceof Error)
        Logger.error(error.message);
      else
        Logger.error(error);
      throw new Error('SMS can not sent');
    }
  }
}
