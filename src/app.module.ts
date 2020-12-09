import { Module } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MenuModule],
})
export class AppModule {}
