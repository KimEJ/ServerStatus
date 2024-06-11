import { Nodes } from '../../models/nodes.model';
import { NodesRepository } from '../nodes.repository.interface';
import { Repository, UpdateResult } from 'typeorm';
import { NodeProfileDto } from '@/nodes/dto/node-profile.dto';
import { NodeUpdateDto } from '@/nodes/dto/node-update.dto';
import { NodeCreateDto } from '@/nodes/dto/node-create.dto';
import { HashingService } from '@/shared/hashing/hashing.service';
import { AccountsNodes } from '@/nodes/interfaces/accounts-nodes.interface';
import { NodeDto } from '@/nodes/dto/node.dto';

export class NodesTypeOrmRepository implements NodesRepository {
  constructor(
    private readonly nodesRepository: Repository<Nodes>,
    private readonly hashingService: HashingService,
  ) {}
  public async updateNode(
    id: number,
    nodeUpdateDto: NodeUpdateDto,
  ): Promise<UpdateResult> {
    return await this.nodesRepository.update(
      {
        id: id,
      },
      { ...nodeUpdateDto },
    );
  }

  public async findAll() {
    return await this.nodesRepository.find();
  }

  public async findByHost(host: string) {
    return await this.nodesRepository.findOneBy({
      host: host,
    });
  }

  public async findBySub(sub: number): Promise<Nodes> {
    return await this.nodesRepository.findOneByOrFail({
      id: sub,
    });
  }

  public async findById(userId: string): Promise<Nodes | null> {
    return await this.nodesRepository.findOneBy({
      id: +userId,
    });
  }

  public async create(nodeCreateDto: NodeCreateDto): Promise<AccountsNodes> {
    const password = Math.random().toString(36).slice(-8)
    const nodeDto: NodeDto = {
      name: nodeCreateDto.name,
      type: nodeCreateDto.type,
      host: nodeCreateDto.host,
      location: nodeCreateDto.location,
      password: await this.hashingService.hash(password),
    }
    return {
      ...(await this.nodesRepository.save(nodeDto)),
      password,
    }
  }

  public async updateByHost(host: string): Promise<Nodes> {
    const node = await this.nodesRepository.findOneBy({ host: host });
    const password = Math.random().toString(36).slice(-8)

    node.password = await this.hashingService.hash(
      password,
    );

    return {
      ...(await this.nodesRepository.save(node)),
      password,
    };
  }

  public async updateNodeProfile(
    id: string,
    nodeProfileDto: NodeProfileDto,
  ): Promise<Nodes> {
    const node = await this.nodesRepository.findOneBy({ id: +id });
    node.name = nodeProfileDto.name;
    node.type = nodeProfileDto.type;
    node.host = nodeProfileDto.host;
    node.location = nodeProfileDto.location;

    return await this.nodesRepository.save(node);
  }

  public async deleteNode(user: any): Promise<void> {
    await this.nodesRepository.remove(user);
  }
}
