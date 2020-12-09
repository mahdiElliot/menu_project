import { EntityRepository, Repository } from "typeorm";
import { Menu } from "./menu.entity";

@EntityRepository(Menu)
export class MenuRepository extends Repository<Menu> {}