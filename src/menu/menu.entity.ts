import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Menu extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    business_id: number;

    @Column()
    name: string;

    @Column()
    pickup: boolean;

    @Column()
    delivery: boolean;

    @Column()
    enabled: boolean;

    @Column()
    eatin: boolean;
}