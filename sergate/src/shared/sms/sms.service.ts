import { Injectable, Logger } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class SmsService {
  private data: FormData = new FormData();
  private httpService: HttpService = new HttpService();

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.httpService.axiosRef.defaults.baseURL = this.configService.get<string>('SMS_BASE_URL');
    this.httpService.axiosRef.defaults.headers.common['CL_AUTH_KEY'] = this.configService.get<string>('SMS_API_KEY');
    this.data.append('from', '01036563620');
  }

  async sendSms(to: Array<string>, text: string) {
    let url = "/send_sms_multi";
    if(to.length === 1) {
      this.data.append('to', to[0]);
      url = "/send_sms";
    } else{
      this.data.append('to_list', '[' + to.join(',') + ']');
    }
    this.data.append('text', text);

    try {
      const { data } = await firstValueFrom(this.httpService.post(url, this.data));
    
      Logger.log(data);
      return data;
      
    } catch (error) {
      Logger.error(error);
      if(error instanceof AxiosError)
        Logger.error(error.response.data);
      throw new Error('SMS can not sent');
    }
  }
}
