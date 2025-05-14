import { ValidationPipe } from '@nestjs/common';
import { MyConfigService } from '../config/config.service';

export const globalvalidationPipe = (config: MyConfigService) => {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    validationError: {
      target: config.getNode() == 'DEV' ? true : false,
      value: config.getNode() == 'DEV' ? true : false,
    },
  });
};
