import {
  Controller,
  HttpStatus,
  HttpCode,
  Get,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ListUsers, GetListUserDto } from './dto/getlist-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  async get(): Promise<ListUsers> {
    let userList: GetListUserDto[] = [];

    userList = await this.userService.getUsers();

    return { users: userList };
  }
}
