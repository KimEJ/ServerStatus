import { MaxLength, IsNotEmpty, IsEmail, IsString, IsInt, IsBoolean, IsNumber, IsDateString } from 'class-validator';

export class DataDto {
    @IsString()
    @IsNotEmpty()
    readonly host: string;

    @IsBoolean()
    @IsNotEmpty()
    readonly online4: boolean;
    @IsBoolean()
    @IsNotEmpty()
    readonly online6: boolean;

    @IsString()
    @IsNotEmpty()
    readonly uptime: string;
    @IsNumber()
    @IsNotEmpty()
    readonly load: number;

    @IsNumber()
    @IsNotEmpty()
    readonly network_rx: number;
    @IsNumber()
    @IsNotEmpty()
    readonly network_tx: number;

    @IsNumber()
    @IsNotEmpty()
    readonly cpu: number;

    @IsNumber()
    @IsNotEmpty()
    readonly memory_total: number;
    @IsNumber()
    @IsNotEmpty()
    readonly memory_used: number;
    @IsNumber()
    @IsNotEmpty()
    readonly swap_total: number;
    @IsNumber()
    @IsNotEmpty()
    readonly swap_used: number;
    @IsNumber()
    @IsNotEmpty()
    readonly hdd_total: number;
    @IsNumber()
    @IsNotEmpty()
    readonly hdd_used: number;
    @IsString()
    readonly custom: string;
    
    @IsDateString()
    readonly created_at: Date;
}
