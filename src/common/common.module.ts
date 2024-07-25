<<<<<<< Updated upstream
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ValidationService],
=======
/**
 * @docs this module for saved prisma, logging and anymore
 *       and this module is set globally so that it can be
 *       used anywhere.
 */

import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from "winston"
import { PrismaService } from './prisma.service';
import  { ValidationService } from "./validation.service"
@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        WinstonModule.forRoot({
            format: winston.format.json(),
            transports: [new winston.transports.Console()]
        }),
    ],
    providers: [PrismaService, ValidationService],
    exports: [PrismaService, ValidationService],
>>>>>>> Stashed changes
})
export class CommonModule {}
