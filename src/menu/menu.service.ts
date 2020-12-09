import { Injectable, NotFoundException } from '@nestjs/common';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { getManager } from 'typeorm';

@Injectable()
export class MenuService {
    async getMenuById(id: number): Promise<Menu> {
        const found = await getManager().query("SELECT * FROM  Menu WHERE id = $1", [id]);
        if (Array.isArray(found) && !found.length) {
            throw new NotFoundException('id not found');
        }
        return found;
    }

    async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
        const { business_id, name, pickup, delivery, enabled, eatin } = createMenuDto;

        const menu = new Menu();
        menu.business_id = business_id;
        menu.name = name;
        menu.delivery = delivery;
        menu.pickup = pickup;
        menu.enabled = enabled;
        menu.eatin = eatin;
        await menu.save();

        return menu;
    }
}
