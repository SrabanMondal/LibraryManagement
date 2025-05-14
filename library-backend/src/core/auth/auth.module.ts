import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MyConfig } from '../config/config.module';
import { MyConfigService } from '../config/config.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [MyConfig],
      inject: [MyConfigService],
      useFactory: (config: MyConfigService) => ({
        secret: config.getJWT(),
        signOptions: { expiresIn: '6h' },
      }),
    }),
    PrismaModule,
    MyConfig,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
