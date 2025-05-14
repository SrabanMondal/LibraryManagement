import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from 'generated/prisma';
import { Observable } from 'rxjs';
export const ROLES_KEY = 'roles';
export enum Role {
  Member = 'member',
  Admin = 'admin',
}
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const req: Request & {
      user: Prisma.UsersGetPayload<{
        select: { id: true; email: true; name: true; role: true };
      }>;
    } = context.switchToHttp().getRequest();
    if (!req.user) {
      return false;
    }
    const userrole: Role = req.user.role as Role;
    return roles.includes(userrole);
  }
}
