import { IsEmail, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';

export class ListUsers {
  @IsArray()
  @ValidateNested({ each: true })
  users: GetListUserDto[];
}

export class GetListUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  id: string;
}
