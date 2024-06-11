import { OmitType } from '@nestjs/swagger';
import { NodeDto } from './node.dto';

export class NodeCreateDto extends OmitType(NodeDto, ['password'] as const) {}
