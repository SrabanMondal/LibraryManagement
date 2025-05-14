import { PipeTransform } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
export class HashPasswordPipe implements PipeTransform {
  async transform(value: Prisma.UsersCreateInput) {
    const salt = await bcrypt.genSalt(10);
    value.password = await bcrypt.hash(value.password, salt);
    return value;
  }
}
