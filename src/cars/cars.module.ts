import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { User } from '../entites/user.entity';
import { Car } from '../entites/car.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Car])],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
