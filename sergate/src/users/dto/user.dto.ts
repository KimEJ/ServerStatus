import { MaxLength, IsNotEmpty, IsEmail, IsString, IsInt } from 'class-validator';

export class UserDto {
  @IsString()
  @MaxLength(30)
  readonly name: string;

  @IsString()
  @MaxLength(40)
  readonly username: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(11)
  readonly phone: string;

  @IsString()
  @MaxLength(20)
  readonly role: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  password: string;
}
