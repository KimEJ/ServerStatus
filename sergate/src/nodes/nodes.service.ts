import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';
import { NodeCreateDto } from './dto/node-create.dto';
import { NodeUpdateDto } from './dto/node-update.dto';
import { UpdateResult } from 'typeorm';

import { NODES_REPOSITORY_TOKEN } from './repositories/nodes.repository.interface';
import { NodesTypeOrmRepository } from './repositories/implementations/nodes.typeorm.repository';
import { NodeDto } from './dto/node.dto';
import { Nodes } from './models/nodes.model';
import { NodeProfileDto } from './dto/node-profile.dto';

@Injectable()
export class NodesService {
  constructor(
    @Inject(NODES_REPOSITORY_TOKEN)
    private readonly nodesRepository: NodesTypeOrmRepository,
  ) {
    console.log('NodesService: ' + this.nodesRepository);
  }
  public async create(nodeCreateDto: NodeCreateDto): Promise<Nodes> {
    return await this.nodesRepository.create(nodeCreateDto);
  }

  public async findAll(): Promise<Nodes[]> {
    return await this.nodesRepository.findAll();
  }
  
  public async findByHost(host: string): Promise<Nodes> {
    const node = await this.nodesRepository.findByHost(host);

    if (!node) {
      throw new NotFoundException(`Node not found`);
    }

    return node;
  }

  public async findBySub(sub: number): Promise<Nodes> {
    const user = await this.nodesRepository.findBySub(sub);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  public async findById(userId: string): Promise<Nodes> {
    const user = await this.nodesRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return user;
  }

  public async updateByHost(host: string): Promise<Nodes> {
    try {
      return await this.nodesRepository.updateByHost(host);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateUserProfile(
    id: string,
    nodeProfileDto: NodeProfileDto,
  ): Promise<Nodes> {
    try {
      return await this.nodesRepository.updateNodeProfile(id, nodeProfileDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateNode(
    id: number,
    nodeUpdateDto: NodeUpdateDto,
  ): Promise<UpdateResult> {
    try {
      return await this.nodesRepository.updateNode(id, nodeUpdateDto);
    } catch (err) {
      throw new BadRequestException('Node not updated');
    }
  }

  public async deleteNode(id: string): Promise<void> {
    const user = await this.findById(id);
    return await this.nodesRepository.deleteNode(user);
  }
}
