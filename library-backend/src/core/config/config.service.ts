import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MyConfig } from './config.interface';

@Injectable()
export class MyConfigService {
  private config: MyConfig;
  constructor(private configservice: ConfigService) {
    const port = configservice.get<number>('PORT');
    const jwt = configservice.get<string>('JWT_SECRET');
    const node = configservice.get<'DEV' | 'PROD'>('NODE_ENV');
    const frontend = configservice.get<string>('FRONTEND');
    if (!jwt || !port || !node || !frontend) {
      throw new NotFoundException('Env variable missing');
    }
    this.config = {
      JWT: jwt,
      NODE: node,
      PORT: port,
      FRONTEND: frontend,
    };
  }
  getJWT(): string {
    return this.config.JWT;
  }
  getNode(): string {
    return this.config.NODE;
  }
  getPort(): number {
    return this.config.PORT;
  }
  getFrontend(): string {
    return this.config.FRONTEND;
  }
}
