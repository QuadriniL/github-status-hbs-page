import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:user')
  async getStats(@Param('user') user): Promise<string> {
    return await this.appService.getStats(user);
  }
}
