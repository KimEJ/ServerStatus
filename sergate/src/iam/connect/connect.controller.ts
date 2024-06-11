import { Controller, Post, Body } from '@nestjs/common';
import { ConnectService } from './connect.service';
import { ConnectDto } from './dto/connect.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthType } from './enums/auth-type.enum';
import { AuthGuard } from './decorators/auth-guard.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth-connect')
@AuthGuard(AuthType.None)
@Controller('connect')
export class ConnectController {
  constructor(private readonly connectService: ConnectService) {}

  @Post('login')
  public async login(@Body() loginDto: ConnectDto): Promise<any> {
    return await this.connectService.login(loginDto);
  }

  @Post('refresh-tokens')
  public async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.connectService.refreshTokens(refreshTokenDto);
  }
}
