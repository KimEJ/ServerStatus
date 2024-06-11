import { PickType } from '@nestjs/swagger';
import { NodeDto } from '@/nodes/dto/node.dto';

export class ConnectDto extends PickType(NodeDto, [
  'host',
  'password',
] as const) {}
