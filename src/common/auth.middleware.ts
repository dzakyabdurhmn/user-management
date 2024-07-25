import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthenticatedMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const token = req.headers['authorization'] as string;

    if (token) {
      const user = await this.prisma.user.findFirst({
        where: {
          token: token,
        },
      });

      if (user) {
        req.user = user;
      }
    }
    next();
  }
}
