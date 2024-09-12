import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;

      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: LoginUserDto) {
    const userFound = await this.validateUser(user.email, user.password);

    const payload = { email: userFound.email, sub: userFound.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);

    const payload = { email: user.email, sub: user.id };

    return {
      userId: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }
}
