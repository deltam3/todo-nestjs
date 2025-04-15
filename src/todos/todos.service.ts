import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entity/todo.entity';
import { User } from 'src/user/entity/user.entity';

interface SyncTodosPropsType {
  todoData: Todo[];
  userId: number;
}

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async syncTodos(todoDataProps: SyncTodosPropsType): Promise<Todo[]> {
    const { userId, todoData } = todoDataProps;
    try {
      // Clear existing todos
      // 여기서 유저아이디의 테이블
      // await this.todoRepository.clear();
      const existingTodos = await this.todoRepository.find({
        where: { user: { id: userId } },
      });

      // Insert new todos
      // const newTodos = await this.todoRepository.save(todoDataProps.todoData);

      if (existingTodos.length > 0) {
        await this.todoRepository.remove(existingTodos);
      }

      // Insert new todos
      const newTodos = await this.todoRepository.save(todoData);

      return newTodos; // Return the newly inserted todos
    } catch (error) {
      console.error('Error syncing todos:', error);
      throw new Error('Failed to sync todos');
    }
  }

  async create(
    localId: number,
    title: string,
    description: string,
    userId: number,
  ): Promise<Todo> {
    // Fetch the user entity based on userId
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found'); // Handle the case where the user does not exist
    }

    // Create the todo item with the user entity
    const todo = this.todoRepository.create({
      localId,
      title,
      description,
      user,
    });

    return this.todoRepository.save(todo);
  }

  // findAll(): Promise<Todo[]> {
  //   return this.todoRepository.find();
  // }
  // async findAll(userId: number): Promise<Todo[]> {
  //   return this.todoRepository.find({
  //     where: {
  //       // user: { id: userId },
  //       user: { id: userId },
  //     },
  //   });
  //   // return this.todoRepository.find();
  // }
  async findAll(userId: number): Promise<Todo[]> {
    return this.todoRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['user'], // This will include user details in the result
    });
  }

  // findOne(id: number): Promise<Todo> {
  //   return this.todoRepository.findOne({ where: { id } });
  // }

  // async update(
  //   id: number,
  //   title: string,
  //   description: string,
  //   completed: boolean,
  // ): Promise<Todo> {
  //   // const todo = await this.findOne(id);
  //   // if (todo) {
  //   //   todo.title = title;
  //   //   todo.description = description;
  //   //   todo.completed = completed;
  //   //   return this.todoRepository.save(todo);
  //   // }
  //   // return null;
  //   const todoItem = await this.todoRepository.findOne({
  //     where: { id },
  //     relations: ['user'], // Load the user relation to check ownership
  //   });
  //   // Check if the todo item exists
  //   if (!todoItem) {
  //     throw new Error('Todo item not found');
  //   }

  //   // Check if the user requesting the deletion is the owner of the todo item
  //   if (todoItem.user.id !== userId) {
  //     throw new Error('You do not have permission to delete this todo item');
  //   }
  //   await this.todoRepository.update({ title });

  //   return { message: 'Todo item deleted successfully' }; // Return a success message
  // }
  async update(
    id: number,
    title: string,
    description: string,
    completed: boolean,
    userId: number, // Add userId parameter to check ownership
  ): Promise<any> {
    //Find the todo item by its ID and load the user relation
    // const todoItem = await this.todoRepository.findOne({
    //   where: { localId: id, user: { id: userId } },
    //   relations: ['user'], // Load the user relation to check ownership
    // });

    // // Check if the todo item exists
    // if (!todoItem) {
    //   throw new Error('Todo item not found');
    // }

    // // Check if the user requesting the update is the owner of the todo item
    // if (todoItem.user.id !== userId) {
    //   throw new Error('You do not have permission to update this todo item');
    // }

    // // Update the todo item properties
    // console.log(todoItem);
    // todoItem.title = title;
    // todoItem.description = description;
    // todoItem.completed = completed;

    // // Save the updated todo item
    // return this.todoRepository.save(todoItem);
    // Update the todo item directly without loading it first
    const result = await this.todoRepository.update(
      { localId: id, user: { id: userId } }, // Find the item by id and user
      { title, description, completed }, // Fields to update
    );
    return result;
    if (result.affected === 0) {
      throw new Error(
        'Todo item not found or you do not have permission to update it',
      );
    }
  }

  // async remove(id: number, userId: number): Promise<void> {
  // async remove(id: number, userId: number): Promise<any> {
  //   // await this.todoRepository.delete(id);
  //   const todoItem = await this.todoRepository.findOne({
  //     where: { id },
  //   });
  //   console.log(todoItem);
  //   if (!todoItem) {
  //     throw new Error('Todo item not found');
  //   }

  //   // if (todoItem !== userId) {
  //   // throw new Error('You do not have permission to delete this todo item');
  //   // }

  //   // return 'delete';
  //   // await this.todoRepository.delete(id);
  //   const user = await this.userRepository.findOne({ where: { id: userId } });

  //   const todoItem = await this.todoRepository.findOne({
  //     where: { id },
  //   });

  //   if (todoItem.user.id === user) {
  //     return await this.todoRepository.delete(id);
  //   }

  //   // const todo = this.todoRepository.create({
  //   //   title,
  //   //   description,
  //   //   user,
  //   // });

  //   // return this.todoRepository.save(todo);
  // }

  async remove(localId: number, userId: number): Promise<any> {
    // Find the todo item by its ID
    // const intId = Number(id);

    const todoItem = await this.todoRepository.findOne({
      where: { localId: localId, user: { id: userId } },
      relations: ['user'], // Load the user relation to check ownership
    });

    // Check if the todo item exists
    if (!todoItem) {
      throw new Error('Todo item not found');
    }

    // Check if the user requesting the deletion is the owner of the todo item
    if (todoItem.user.id !== userId) {
      throw new Error('You do not have permission to delete this todo item');
    }

    // If the user is the owner, proceed to delete the todo item
    // await this.todoRepository.delete(id);
    await this.todoRepository.delete(todoItem);

    return { message: 'Todo item deleted successfully' }; // Return a success message
  }
}
