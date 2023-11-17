import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { GetUserData } from '../types';

export const GetUser = createParamDecorator(
  (data: GetUserData, ctx: ExecutionContext): Express.User | number => {
    const request: Request = ctx.switchToHttp().getRequest();
    const { user } = request;

    return user && data ? user[data] : user;
  },
);
