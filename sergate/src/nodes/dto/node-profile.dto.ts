import { OmitType } from '@nestjs/swagger';
import { NodeDto } from './node.dto';

export class NodeProfileDto extends OmitType(NodeDto, ['password'] as const) {}
