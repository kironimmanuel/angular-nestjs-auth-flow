import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    // omit from swagger

    @Get()
    getData() {
        return this.appService.getData();
    }
}
