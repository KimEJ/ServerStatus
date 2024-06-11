import { NodeProfileDto } from '../dto/node-profile.dto';
import { NodeUpdateDto } from '../dto/node-update.dto';
import { NodeDto } from '../dto/node.dto';

export interface NodesRepository {
  findAll(): void;
  findByHost(host: string): void;
  findBySub(sub: number): void;
  findById(userId: string): void;
  create(userDto: NodeDto): void;
  updateByHost(host: string): void;
  updateNodeProfile(id: string, nodeProfileDto: NodeProfileDto): void;
  updateNode(id: number, nodeUpdateDto: NodeUpdateDto): void;
  deleteNode(id: string): void;
}

export const NODES_REPOSITORY_TOKEN = 'nodes-repository-token';
