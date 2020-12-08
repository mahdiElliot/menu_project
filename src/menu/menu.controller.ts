import { Controller, Get } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('tasks')
export class MenuController {

    //injection happens automatically
    constructor(private menusService: MenuService) {}

    @Get()
    getAllMenus(){
        return this.menusService.getAllMenus();
    }
}
