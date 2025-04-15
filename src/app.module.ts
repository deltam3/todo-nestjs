import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql_db',
      port: 3306,
      database: 'nestjs_docker_tutorial',
      // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      // entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      entities: ['dist/**/*.entity.js'],
      username: 'testuser',
      password: 'testuser123',
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TodosModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
