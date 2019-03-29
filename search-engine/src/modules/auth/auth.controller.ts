import { Controller, Get, UseGuards, Res, Req, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    const jwt: string = req.user.jwt;
    if (jwt) {
      res.redirect('http://localhost:3000/auth/success/?jwt=' + jwt);
    } else {
      res.redirect('http://localhost:3000/auth/fail');
    }
  }

  @Get('success')
  async success(@Query() jwt): Promise<string> {
    return 'Authorization successful!';
  }

  @Get('fail')
  fail(): string {
    return 'Authorization failed!';
  }
}
