import {
  All,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { CarsModule } from './cars/cars.module';
import { Car } from './entites/car.entity';
import { AuthMiddlewareMiddleware } from './middleware/auth-middleware/auth-middleware.middleware';
// TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: 'localhost',
//   port: 3306,
//   username: 'root',
//   password: '',
//   database: 'jit_training_db',
//   entities: [User, Car],
//   synchronize: true,
// })
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://sdiuvghn:HjpzSXHepJ443nTPlKuSOln14XP1pWXi@floppy.db.elephantsql.com/sdiuvghn',
      autoLoadEntities: true,
      synchronize: true,
    }),
    JwtModule.register({
      secret: 'JIT-TRAINING',
    }),
    UsersModule,
    CarsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddlewareMiddleware)
      .exclude(
        {
          path: '/auth/login',
          method: RequestMethod.POST,
        },
        {
          path: '/auth/register',
          method: RequestMethod.POST,
        },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
