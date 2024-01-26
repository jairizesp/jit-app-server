import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddlewareMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      let str = '';
      const token = req.headers.authorization.replace('Bearer', '').trim();

      str = token.replace(/['"]+/g, '');

      const validated = await this.jwtService.verifyAsync(str, {
        secret: 'JIT-TRAINING',
      });
      req.body._validated = validated;
    } catch (error) {
      console.log(error);
      // Handle the error, and send an appropriate response
      res.writeHead(401, { 'content-type': 'application/json' });
      res.write(
        JSON.stringify({
          status: 401,
          error: 'Unauthorized',
          msg: 'Invalid token',
        }),
      );
      res.end();
      return;
    }
    next();
  }
}
