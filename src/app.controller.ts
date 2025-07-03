import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpStatus } from './utils/httpStatus';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/restaurant', HttpStatus.REDIRECT)
  redirectToRestaurant() {}
}
