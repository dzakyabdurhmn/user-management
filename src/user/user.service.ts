import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../model/user.model';
import { Logger } from 'winston';
import { UserValidationZodSchema } from './user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    // data validation
    private validation: ValidationService,
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}
  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`register by user ${JSON.stringify(request)}`);
    /**
     *   @docs : in the frist argument send schema and second argument send data
     **/
    const registerRequest: RegisterUserRequest = this.validation.validate(
      UserValidationZodSchema.REGISTER,
      request,
    );

    /**
     *  @docs : check username in database if usename arledy or not
     */
    const isArledy = await this.prisma.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (isArledy != 0) {
      throw new HttpException('username arledy register', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prisma.user.create({
      data: registerRequest,
    });

    return {
      name: user.name,
      username: user.username,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info(`userService.login(${JSON.stringify(request)})`);

    const loginRequest: LoginUserRequest = this.validation.validate(
      UserValidationZodSchema.LOGIN,
      request,
    );

    let user = await this.prisma.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Username or password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Username or password is invalid', 401);
    }

    user = await this.prisma.user.update({
      where: {
        username: loginRequest.username,
      },

      data: {
        token: uuid(),
      },
    });
    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }

  /**
   * @docs : get user data with middleware and decorator
   */

  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
    };
  }
}
