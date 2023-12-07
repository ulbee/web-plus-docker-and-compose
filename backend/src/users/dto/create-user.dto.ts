import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { DEFAULT_USER_ABOUT, DEFAULT_USER_AVATAR } from 'src/constants/users';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 30)
  @IsString()
  username: string;

  @Optional()
  @IsString()
  @Length(2, 200)
  about: string = DEFAULT_USER_ABOUT;

  @Optional()
  @IsUrl()
  avatar: string = DEFAULT_USER_AVATAR;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
