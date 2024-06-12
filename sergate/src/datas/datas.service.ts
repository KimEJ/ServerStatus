import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodesService } from '@/nodes/nodes.service';
import { DataDto } from './dto/data.dto';
import { DATAS_REPOSITORY_TOKEN } from './repositories/datas.repository.interface';
import { DatasTypeOrmRepository } from './repositories/implementations/datas.typeorm.repository';
import { Datas } from './models/datas.model';

import { Accountsdatas } from './interfaces/accounts-datas.interface';
import { HashingService } from '@/shared/hashing/hashing.service';
import { SmsService } from '@/shared/sms/sms.service';
import { UsersService } from '@/users/users.service';

@Injectable()
export class DatasService {
  constructor(
    @Inject(DATAS_REPOSITORY_TOKEN)
    private readonly datasRepository: DatasTypeOrmRepository,
    private readonly nodesService: NodesService,
    private readonly usersService: UsersService,
    private readonly smsService: SmsService,
  ) {}
  public async create(dataDto: DataDto): Promise<Accountsdatas> {

    const data = await this.datasRepository.create(dataDto);
    const node = await this.nodesService.findByHost(dataDto.host);
    if (!node) {
      throw new Error('Node not found');
    }
    const date = new Date();

    try {
      if(node.maxCPU !== null && node.minCPU !== null) {
        if(node.maxCPU < dataDto.cpu) {
          throw new Error(`${node.host}노드의 CPU가 과부하 상태입니다.`);
        } else if(node.minCPU > dataDto.cpu) {
          throw new Error(`${node.host}노드의 CPU가 저하 상태입니다.`);
        }
      } else if(node.maxMemory !== null && node.minMemory !== null) {
        if(node.maxMemory < dataDto.memory_used) {
          throw new Error(`${node.host}노드의 메모리가 과부하 상태입니다.`);
        } else if(node.minMemory > dataDto.memory_used) {
          throw new Error(`${node.host}노드의 메모리가 저하 상태입니다.`);
        }
      } else if(node.maxNetwork !== null && node.minNetwork !== null) {
        if(node.maxNetwork < dataDto.network_rx || node.maxNetwork < dataDto.network_tx) {
          throw new Error(`${node.host}노드의 네트워크가 과부하 상태입니다.`);
        } else if(node.minNetwork > dataDto.network_rx || node.minNetwork > dataDto.network_tx) {
          throw new Error(`${node.host}노드의 네트워크가 저하 상태입니다.`);
        }
      } else if(node.maxLoad !== null && node.minLoad !== null) {
        if(node.maxLoad < dataDto.load) {
          throw new Error(`${node.host}노드의 Load가 과부하 상태입니다.`);
        } else if(node.minLoad > dataDto.load) {
          throw new Error(`${node.host}노드의 Load가 저하 상태입니다.`);
        }
      }
    } catch (error) {
      if(error instanceof Error) {
        // lastAlert is null or timeLimitAlert(secounds) is passed
        if(node.lastAlert === null || date.getTime() - node.timeLimitAlert * 1000 > node.lastAlert.getTime()){
          Logger.error(`Alert sent to ${node.host}: ${error.message}`);
          try {
            const user = (await this.usersService.findAdmin()).map(user => user.phone);
            await this.smsService.sendSms(user, error.message);
            node.lastAlert = date;
          } catch (error) {
            Logger.error(`Alert can not sent to ${node.host}: ${error}`);
          }
        }
      } else {
        throw error;
      }
    } finally {
      node.lastSync = date;
      await this.nodesService.updateNode(node.id, node);
    }

    return data
  }

  public async findAll(): Promise<Datas[]> {
    return await this.datasRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} data`;
  }

  remove(id: number) {
    return `This action removes a #${id} data`;
  }

  public async removeOldDatas(host: string) {
    return await this.datasRepository.removeOldDatas(host);
  }
}
