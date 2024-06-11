import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { NodeUpdateDto } from './dto/node-update.dto';
import { NodeDto } from './dto/node.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/iam/login/decorators/auth-guard.decorator';
import { AuthType } from '@/iam/login/enums/auth-type.enum';
import { NodeCreateDto } from './dto/node-create.dto';

@ApiTags('nodes')
@AuthGuard(AuthType.Bearer)
@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Post()
  public async create(@Body() nodeCreateDto: NodeCreateDto) {
    return this.nodesService.create(nodeCreateDto);
  }

  @Get()
  public async findAllNode() {
    return this.nodesService.findAll();
  }

  @Get('/:id')
  public async findOneNode(@Param('id') id: string) {
    return this.nodesService.findById(id);
  }

  @Patch('/:id')
  public async update(@Param('id') id: number, @Body() updateNodeDto: NodeUpdateDto) {
    return this.nodesService.updateNode(id, updateNodeDto);
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    return this.nodesService.deleteNode(id);
  }
}
