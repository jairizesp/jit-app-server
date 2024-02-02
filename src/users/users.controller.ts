import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entites/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('auth')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async create(@Body() body: User) {
    const is_existing = await this.userService.findByEmail(body.email);

    if (is_existing) {
      return {
        status: HttpStatus.CONFLICT,
        error: 'Email already exists',
      };
    }

    const hashed_password = await bcrypt.hash(body.password, 12);

    if (body.password.length < 6) {
      return {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'Password must contain 6 or more characters',
      };
    }

    await this.userService.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: hashed_password,
    });

    return {
      status: 200,
    };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new BadRequestException('Invalid Credentials');

    if (!(await bcrypt.compare(password, user.password)))
      return {
        status: 400,
        error: 'Bad Request',
        msg: 'Invalid Credentials',
      };

    const jwt = await this.jwtService.signAsync({ id: user.id });

    const res: { token: string; user: User; status: number } = {
      token: jwt,
      user: { ...user, password: undefined },
      status: 200,
    };

    response.cookie('jwt', jwt, { httpOnly: true });

    return res;
  }
}
