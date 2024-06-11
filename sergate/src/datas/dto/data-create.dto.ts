import { OmitType } from '@nestjs/swagger';
import { DataDto } from './data.dto';

export class DataCreateDto extends OmitType(DataDto, [
    'online4', 'online6', 
    'host',
    'created_at'
] as const) {}
