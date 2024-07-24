// zod schema

import { z, ZodType } from 'zod';

export class UserValidationZodSchema {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(1).max(15),
    password: z.string().min(8).max(25),
    name: z.string().min(3).max(100),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1).max(15),
    password: z.string().min(8).max(25),
  });
}
