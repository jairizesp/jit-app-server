import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../entites/car.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car) private readonly carRepository: Repository<Car>,
  ) {}

  async create(payload: Car): Promise<Car> {
    return await this.carRepository.save(payload);
  }

  async findAll(queryParams: any): Promise<Car[]> {
    const { page = 1, limit = 10, sortBy, sortOrder, ...filters } = queryParams;
    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<Car> = {
      skip,
      take: limit,
      order: sortBy ? { [sortBy]: sortOrder || 'ASC' } : undefined,
      where: filters,
    };

    return this.carRepository.find(findOptions);
  }

  async findOne(id: number): Promise<Car> | null {
    return await this.carRepository.findOneBy({
      id,
    });
  }

  async update(id: number, payload: Car): Promise<Car> {
    return await this.carRepository.save({
      id,
      ...payload,
    });
  }

  async findMake(): Promise<string[]> {
    return await this.carRepository
      .createQueryBuilder('cars')
      .select('DISTINCT cars.make', 'make')
      .getRawMany();
  }

  async findModel(): Promise<string[]> {
    return await this.carRepository
      .createQueryBuilder('cars')
      .select('DISTINCT cars.model', 'model')
      .getRawMany();
  }

  async findYear(): Promise<string[]> {
    return await this.carRepository
      .createQueryBuilder('cars')
      .select('DISTINCT cars.year', 'year')
      .getRawMany();
  }
}
