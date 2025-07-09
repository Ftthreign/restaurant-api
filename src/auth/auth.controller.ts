import {
  Controller,
  UseGuards,
  Post,
  Request,
  Body,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { HttpStatus } from 'src/utils/httpStatus';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.SUCCESS)
  @Post('logout')
  async logout(@Request() req) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      await this.authService.blacklistToken(token);

      return {
        message: 'Logout Successful',
      };
    }

    return {
      message: 'Token not provided or invalid',
    };
  }
}
