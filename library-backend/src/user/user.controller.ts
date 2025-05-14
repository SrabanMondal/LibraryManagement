import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from 'generated/prisma';
import { HashPasswordPipe } from 'src/core/pipes/hash-pipe';
import { ValidateUserPipe } from 'src/core/pipes/user-pipe';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UsePipes(new HashPasswordPipe())
  @Post('/register')
  async register(@Body() userData: Prisma.UsersCreateInput) {
    console.log('user added');
    await this.userService.create(userData);
    return { message: 'User created', status: true };
  }
  @UsePipes(ValidateUserPipe)
  @Post('/login')
  async login(
    @Body()
    loginData: {
      user: Prisma.UsersGetPayload<{
        select: { id: true; email: true; password: true; role: true };
      }>;
      password: string;
    },
  ) {
    const { user, password } = loginData;
    const { role, message, token } = await this.userService.login(
      user,
      password,
    );
    return { role, message, token };
  }
  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  async findById(
    @Req()
    req: Request & {
      user: Prisma.UsersGetPayload<{
        select: { id: true; email: true; name: true; role: true };
      }>;
    },
  ) {
    const user = await this.userService.findOne(req.user.id);
    return user;
  }
}
