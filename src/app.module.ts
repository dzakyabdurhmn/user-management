import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
<<<<<<< Updated upstream
import { UserModule } from './user/user.module';

@Module({
  imports: [CommonModule, UserModule],
=======

@Module({
  imports: [CommonModule],
>>>>>>> Stashed changes
  controllers: [],
  providers: [],
})
export class AppModule {}
