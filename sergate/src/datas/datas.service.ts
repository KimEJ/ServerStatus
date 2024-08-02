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
  alert: Array<ReturnType<typeof setTimeout>> = [];

  constructor(
    @Inject(DATAS_REPOSITORY_TOKEN)
    private readonly datasRepository: DatasTypeOrmRepository,
    private readonly nodesService: NodesService,
    private readonly usersService: UsersService,
    private readonly smsService: SmsService,
  ) { }
  public async create(dataDto: DataDto): Promise<Accountsdatas> {

    let node = await this.nodesService.findByHost(dataDto.host);
    if (!node) {
      throw new Error('Node not found');
    }
    const date = new Date();
    Logger.debug("dataDto: ", dataDto);
    Logger.debug("node: ", node);

    node.lastSync = date;
    await this.nodesService.updateNode(node.id, node);
    
    let time = {}
    try {
      if (node.maxCPU !== null && node.maxCPU < dataDto.cpu) {
        if (node.CPULastAlert === null || date.getTime() - node.timeLimitAlert * 1000 > node.CPULastAlert.getTime()) {
          time = { CPULastAlert: date };
          throw new Error(`${node.host}노드의 CPU가 과부하 상태입니다.`);
        }
      } else if (node.minCPU !== null && node.minCPU > dataDto.cpu) {
        if (node.CPULastAlert === null || date.getTime() - node.timeLimitAlert * 1000 > node.CPULastAlert.getTime()) {
          time = { CPULastAlert: date };
          throw new Error(`${node.host}노드의 CPU가 저하 상태입니다.`);
        }
      } else if (node.maxMemory !== null && node.maxMemory < dataDto.memory_used) {
        if (node.memoryLastAlert === null || date.getTime() - node.timeLimitAlert * 1000 > node.memoryLastAlert.getTime()) {
          time = { memoryLastAlert: date };
          throw new Error(`${node.host}노드의 메모리가 과부하 상태입니다.`);
        }
      } else if (node.minMemory !== null && node.minMemory > dataDto.memory_used) {
        if (node.memoryLastAlert === null || date.getTime() - node.timeLimitAlert * 1000 > node.memoryLastAlert.getTime()) {
          time = { memoryLastAlert: date };
          throw new Error(`${node.host}노드의 메모리가 저하 상태입니다.`);
        }
      } else if (node.maxNetwork !== null && (node.maxNetwork < dataDto.network_rx || node.maxNetwork < dataDto.network_tx)) {
        if (node.networkLastAlert === null || date.getTime() - node.timeLimitAlert * 1000 > node.networkLastAlert.getTime()) {
          time = { networkLastAlert: date };
          throw new Error(`${node.host}노드의 네트워크가 과부하 상태입니다.`);
        }
      } else if (node.minNetwork !== null && (node.minNetwork > dataDto.network_rx || node.minNetwork > dataDto.network_tx)) {
        if (node.networkLastAlert === null || date.getTime() - node.timeLimitAlert * 1000 > node.networkLastAlert.getTime()) {
          time = { networkLastAlert: date };
          throw new Error(`${node.host}노드의 네트워크가 저하 상태입니다.`);
        }
      } else if (node.minNetwork !== null && node.maxLoad < dataDto.load) {
        if (node.loadLastAlert === null || date.getTime() - node.timeLimitAlert * 1000 > node.loadLastAlert.getTime()) {
          time = { loadLastAlert: date };
          throw new Error(`${node.host}노드의 Load가 과부하 상태입니다.`);
        }
      } else if (node.minLoad !== null && node.minLoad > dataDto.load) {
        if (node.loadLastAlert === null || date.getTime() - node.timeLimitAlert * 1000 > node.loadLastAlert.getTime()) {
          time = { loadLastAlert: date };
          throw new Error(`${node.host}노드의 Load가 저하 상태입니다.`);
        }
      }
      // Clear alert
      this.alert.forEach(() => {
        clearTimeout(this.alert.pop());
      });
    } catch (error) {
      if (error instanceof Error) {
        this.alert.push(setTimeout(async () => {
          try {
            const user = (await this.usersService.findAdmin()).map(user => user.phone);

            const KST = date.getTime() + (9 * 60 * 60 * 1000);
            const datetime = new Date(KST).toISOString().replace(/T/, ' ').replace(/\..+/, '');
            await this.smsService.sendSms(user, error.message + datetime);
            node = { ...node, ...time };
            await this.nodesService.updateNode(node.id, node);
            Logger.debug(`Alert sent to ${node.host}: ${error.message}`);
          } catch (error) {
            Logger.error(`Alert can not sent to ${node.host}: ${error}`);
          }
        }, 5000))
      } else {
        throw error;
      }
    } finally {
      const data = await this.datasRepository.create(dataDto);
      return data
    }
  }

  public async findAll(): Promise<Datas[]> {
    return await this.datasRepository.findAll();
  }

  public async findOne(host: string) {
    return await this.datasRepository.findByHost(host);
  }

  remove(id: number) {
    return `This action removes a #${id} data`;
  }

  public async removeOldDatas(host: string) {
    return await this.datasRepository.removeOldDatas(host);
  }
}
