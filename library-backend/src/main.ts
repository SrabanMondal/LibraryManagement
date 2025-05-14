import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyConfigService } from './core/config/config.service';
import { GlobalException } from './core/excepion/global-exception';
import { globalvalidationPipe } from './core/pipes/global-validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<MyConfigService>(MyConfigService);
  const port = config.getPort();
  app.enableCors({
    origin: config.getNode() == 'DEV' ? '*' : config.getFrontend(),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    //exposedHeaders: ['Content-Length', 'Content-Type'],
    //credentials: true,
  });
  app.useGlobalFilters(new GlobalException(app.get(HttpAdapterHost)));
  app.useGlobalPipes(globalvalidationPipe(config));
  app.enableShutdownHooks();
  await app.listen(port ?? 3000);
  console.log(`Server running on port ${port}`);
}
bootstrap()
  .then(() => console.log('Application Started'))
  .catch((err: unknown) => {
    console.error('Application failed to start:', err);
    process.exit(1);
  });
