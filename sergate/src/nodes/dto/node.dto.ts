import { MaxLength, IsNotEmpty, IsEmail, IsString, IsInt } from 'class-validator';

export class NodeDto {
    @IsString()
    @MaxLength(30)
    readonly name: string;

    @IsString()
    @MaxLength(40)
    readonly type: string;

    @IsString()
    @IsNotEmpty()
    readonly host: string;

    @IsString()
    @IsNotEmpty()
    readonly location: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;

}
