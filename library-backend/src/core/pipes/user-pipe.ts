import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ValidateUserPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(value: { email: string; password: string }): Promise<{
    user: Prisma.UsersGetPayload<{
      select: { password: true; email: true; id: true; role: true };
    }>;
    password: string;
  }> {
    const { email, password } = value;
    const user = await this.prisma.users.findUnique({
      where: { email },
      select: { email: true, password: true, id: true, role: true },
    });
    if (!user) {
      console.log('user not found');
      throw new NotFoundException('User not found');
    }
    return { user, password };
  }
}
