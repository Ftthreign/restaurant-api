import { Controller, Get, Redirect } from '@nestjs/common';
import { HttpStatus } from './utils/httpStatus';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Default Endpoint')
@Controller()
export class AppController {
  @Get()
  @Redirect('/users/register', HttpStatus.REDIRECT)
  @ApiOperation({ summary: 'Redirect to the registration page' })
  @ApiResponse({
    status: HttpStatus.REDIRECT,
    description: 'Redirects to the registration page.',
  })
  redirectToRegisterUser() {}
}
