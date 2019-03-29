import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';
import { Environments } from './enums/environments';
import { ConfigModule } from './modules/config/config.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.load(`./.env.${process.env.NODE_ENV || Environments.DEV}`),
    AuthModule,
    ApiModule,
  ],
})
export class AppModule {}
