import { Controller, Get, Param, ParseIntPipe, Post, Body } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';

@Controller('tasks')
export class MenuController {

    //injection happens automatically
    constructor(private menusService: MenuService) {}

    // @Get()
    // getAllMenus(){
    //     return this.menusService.getAllMenus();
    // }

    @Get('/:id')
    getMenuById(@Param('id', ParseIntPipe) id: number): Promise<Menu>{
        return this.menusService.getMenuById(id);
    }

    @Post()
    createMenu(@Body() createMenuDto: CreateMenuDto): Promise<Menu> {
        return this.menusService.createMenu(createMenuDto);
    }
}
