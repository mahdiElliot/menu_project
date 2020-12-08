import { Injectable } from '@nestjs/common';
import { Menu } from './menu.model';

@Injectable()
export class MenuService {
    private menus: Menu[] = [];

    getAllMenus(): Menu[]{
        return this.menus;
    }
}
