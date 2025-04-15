import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entity/todo.entity';
import { User } from 'src/user/entity/user.entity';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  exports: [],
  imports: [TypeOrmModule.forFeature([Todo, User])],
})
export class TodosModule {}
