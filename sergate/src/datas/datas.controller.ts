import { Controller, Get, Post, Body, Param, Headers, Logger, Ip } from '@nestjs/common';
import { DatasService } from './datas.service';
import { DataDto } from './dto/data.dto';
import { DataCreateDto } from './dto/data-create.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/iam/login/decorators/auth-guard.decorator';
import { AuthType } from '@/iam/login/enums/auth-type.enum';
import { JwtService } from '@nestjs/jwt';

@ApiTags('datas')
@AuthGuard(AuthType.Bearer)
@Controller('datas')
export class DatasController {
  constructor(
    private readonly datasService: DatasService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async create(
    @Headers('Authorization') token: string,
    @Ip() ip: string,
    @Body() dataCreateDto: DataCreateDto
  ) {
    const decoded = this.jwtService.decode(token.replace('Bearer ', ''), { json: true });
    const dataDto: DataDto = {
      ...dataCreateDto,
      host: decoded.host,
      online4: ip.includes(':'),
      online6: ip.includes(':'),
      created_at: new Date(),
    };

    await this.datasService.removeOldDatas(decoded.host)
    return await this.datasService.create(dataDto);
  }

  @Get()
  findAll() {
    return this.datasService.findAll();
  }

  @Get(':host')
  findOne(@Param('host') host: string) {
    return this.datasService.findOne(host);
  }
}
