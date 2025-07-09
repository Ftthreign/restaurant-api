import { Controller, UseGuards, Post, Request, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { HttpStatus } from 'src/utils/httpStatus';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.SUCCESS)
  @ApiOperation({ summary: 'Login with registered credentials' })
  @ApiBody({
    type: LoginDto,
    description: 'Credentials untuk login',
  })
  @ApiResponse({
    status: HttpStatus.SUCCESS,
    description: 'Login berhasil, JWT token dikembalikan.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Input tidak valid atau format salah.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Email atau password salah.',
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.SUCCESS)
  @ApiOperation({ summary: 'Logout dan blacklist token saat ini' })
  @ApiResponse({
    status: HttpStatus.SUCCESS,
    description: 'Berhasil logout dan token diblacklist.',
    schema: {
      example: {
        message: 'Logout Successful',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Token tidak diberikan atau tidak valid.',
    schema: {
      example: {
        message: 'Token not provided or invalid',
      },
    },
  })
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
