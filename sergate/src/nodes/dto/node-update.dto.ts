import { PartialType } from '@nestjs/swagger';
import { NodeDto } from './node.dto';

export class NodeUpdateDto extends PartialType(NodeDto) {}
