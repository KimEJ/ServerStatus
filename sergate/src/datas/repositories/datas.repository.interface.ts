import { NodeDto } from '@/nodes/dto/node.dto';
import { DataDto } from '../dto/data.dto';

export interface DatasRepository {
  findAll(): void;
  findByHost(host: string): void;
  findBySub(sub: number): void;
  findById(dataId: string): void;
  create(dataDto: DataDto, node: NodeDto): void;
}

export const DATAS_REPOSITORY_TOKEN = 'datas-repository-token';
