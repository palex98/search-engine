import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './passport/google.strategy';
import { ExpressSessionMiddleware } from '@nest-middlewares/express-session';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // ExpressSessionMiddleware.configure({ secret: 'this is secret' });
    // consumer.apply(ExpressSessionMiddleware).forRoutes('auth/google');
  }
}
