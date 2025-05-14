import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(private jwtservice: JwtService) {}
  createtoken(
    user: Prisma.UsersGetPayload<{
      select: { id: true; email: true; password: true; role: true };
    }>,
  ) {
    const payload = { id: user.id, role: user.role };
    const token = this.jwtservice.sign(payload);
    return token;
  }
  decodetoken(token: string) {
    try {
      const payload = this.jwtservice.verify<{ id: number; role: string }>(
        token,
      );
      return payload;
    } catch (error) {
      throw new UnauthorizedException('user not authorized' + String(error));
    }
  }
}
