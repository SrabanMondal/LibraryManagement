import {
  BadRequestException,
  Injectable,
  //NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/core/auth/auth.service';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authservice: AuthService,
  ) {}

  async create(data: Prisma.UsersCreateInput) {
    const user = await this.prisma.users.findUnique({
      where: { email: data.email },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    return await this.prisma.users.create({ data });
  }
  async login(
    user: Prisma.UsersGetPayload<{
      select: { id: true; email: true; password: true; role: true };
    }>,
    password: string,
  ) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.authservice.createtoken(user);
    return { role: user.role, message: 'Login successful', token };
  }

  findAll() {
    return this.prisma.users.findMany({
      include: {
        Transactions: {
          include: {
            book: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.users.findUnique({
      where: { id },
      include: {
        Transactions: {
          include: {
            book: true,
          },
        },
      },
    });
  }
}
