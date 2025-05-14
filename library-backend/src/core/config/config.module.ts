import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MyConfigService } from './config.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        FRONTEND: Joi.string().required(),
        NODE_ENV: Joi.string().valid('DEV', 'PROD').default('DEV'),
        PORT: Joi.number().required(),
      }),
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
        stripUnknowne: false,
      },
      cache: true,
    }),
  ],
  providers: [MyConfigService],
  exports: [MyConfigService],
})
export class MyConfig {}
