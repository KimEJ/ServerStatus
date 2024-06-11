import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NodesService } from '@/nodes/nodes.service';
import { AccountsNodes } from '@/nodes/interfaces/accounts-nodes.interface';
import { ConnectDto } from './dto/connect.dto';
import { ConfigType } from '@nestjs/config';
import { HashingService } from '@/shared/hashing/hashing.service';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Nodes } from '@/nodes/models/nodes.model';
import jwtConfig from './config/jwt.config';

@Injectable()
export class ConnectService {
  constructor(
    private readonly nodesService: NodesService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly hashingService: HashingService,
  ) {}

  public async findNodeByHost(connectDto: ConnectDto): Promise<AccountsNodes> {
    return await this.nodesService.findByHost(connectDto.host);
  }

  public async login(connectDto: ConnectDto): Promise<any> {
    try {
      const node = await this.findNodeByHost(connectDto);
      if (!node) {
        throw new UnauthorizedException('User does not exists');
      }

      const passwordIsValid = await this.hashingService.compare(
        connectDto.password,
        node.password,
      );

      if (!passwordIsValid) {
        throw new UnauthorizedException(
          'Authentication failed. Wrong password',
        );
      }

      return await this.generateTokens(node);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async generateTokens(node: Nodes) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<JWTPayload>>(
        node.id,
        this.jwtConfiguration.accessTokenTtl,
        { host: node.host},
      ),
      this.signToken(node.id, this.jwtConfiguration.refreshTokenTtl),
    ]);
    return {
      accessToken,
      refreshToken,
      user: { 
        id: node.id,
        name: node.name,
        host: node.host,
      },
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { id } = await this.jwtService.verifyAsync<Pick<JWTPayload, 'id'>>(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );
      const node = await this.nodesService.findBySub(id);
      return this.generateTokens(node);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
