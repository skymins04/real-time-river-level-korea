import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

enum Role {
  riverlevel = 'riverlevel',
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();

    return roles.some((role) => user.role.split(',').indexOf(role) !== -1);
  }
}
