import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUserRole } from '@prisma/client';
import { PrismaService } from '~lib/prisma/prisma.service';
import { ROLES_KEY } from '../../auth/constants';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //  Get the required roles from the @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<AuthUserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles) return true;

    // Get the user object from the request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user object exists, deny access
    if (!user) return false;

    // Get the user's role from the database
    const foundUser = await this.prisma.authUser.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    // If the user's role is not in the required roles, deny access
    return requiredRoles.includes(foundUser.role);
  }
}
