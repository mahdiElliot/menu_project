import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

    //injection happens automatically
    constructor(private tasksService: TasksService) {}

    @Get()
    getAllTasks(){
        return this.tasksService.getAllTasks();
    }
}
