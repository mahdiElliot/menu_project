import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuRepository } from './menu.repository';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(MenuRepository)
        private menuRepository: MenuRepository
    ) { }

    async getMenuById(id: number): Promise<Menu> {
        const found = await this.menuRepository.query("SELECT * FROM Menu WHERE id=1");
        if (!found){
            throw new NotFoundException('not');
        }
        return found;
    }

    async createMenu(createMenuDto: CreateMenuDto): Promise<Menu>{
        const {business_id, name, pickup, delivery, enabled, eatin} = createMenuDto;

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
