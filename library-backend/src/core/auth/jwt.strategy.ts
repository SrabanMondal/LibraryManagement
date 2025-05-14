import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MyConfigService } from '../config/config.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: MyConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.getJWT(),
    });
  }

  async validate(payload: { id: number; role: string }) {
    const user = await this.prisma.users.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, role: true, email: true },
    });
    if (!user) {
      throw new UnauthorizedException('User not authorized');
    }
    return user;
  }
}
