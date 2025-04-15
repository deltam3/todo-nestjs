import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';

import { Todo } from './entity/todo.entity';
import { TodosService } from './todos.service';

import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post('sync')
  snyncTodos(@Request() req, @Body() todoData: Todo[]): Promise<Todo[]> {
    const userId = req.user.id;
    return this.todosService.syncTodos({ todoData, userId });
  }

  @Post()
  create(
    @Request() req,
    @Body() todoData: { title: string; description: string; localId: number },
  ): Promise<Todo> {
    const userId = req.user.id;
    return this.todosService.create(
      todoData.localId,
      todoData.title,
      todoData.description,
      userId,
    );
  }

  @Get()
  async getTodos(@Request() req) {
    const userId = req.user.id;
    return this.todosService.findAll(userId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body()
    todoData: { title: string; description: string; completed: boolean },
  ): Promise<Todo> {
    const userId = req.user.id;
    return this.todosService.update(
      Number(id),
      todoData.title,
      todoData.description,
      todoData.completed,
      userId,
    );
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') localId: number): Promise<void> {
    const userId = req.user.id;

    return this.todosService.remove(localId, userId);
  }
}
