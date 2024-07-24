import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  async deleteUser() {
    await this.prisma.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async createUser() {
    await this.prisma.user.deleteMany({
      where: {
        username: 'test',
      },
    });
    await this.prisma.user.create({
      data: {
        name: 'test',
        username: 'test',
        password: await bcrypt.hash('test', 10),
      },
    });
  }
}
