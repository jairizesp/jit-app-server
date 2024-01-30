import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../entites/car.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car) private readonly carRepository: Repository<Car>,
  ) {}

  async create(payload: Car): Promise<Car> {
    return await this.carRepository.save(payload);
  }

  async findAll(queryParams: any): Promise<Car[]> {
    const {
      page = 1,
      limit = 5,
      sortBy = 'make',
      sortOrder,
      ...filters
    } = queryParams;

    const skip = (page - 1) * limit;

    const whereClause: Record<string, any> = {};

    if (filters && filters.make) {
      whereClause.make = filters.make;
    }

    if (filters && filters.model) {
      whereClause.model = filters.model;
    }

    if (filters && filters.year) {
      whereClause.year = filters.year;
    }

    if (filters && filters.from !== undefined && filters.to !== undefined) {
      whereClause.price = Between(filters.from, filters.to);
    }

    const findOptions: FindManyOptions<Car> = {
      skip,
      take: limit,
      order: sortBy ? { [sortBy]: sortOrder || 'ASC' } : undefined,
      where: whereClause,
    };

    return this.carRepository.find(findOptions);
  }

  async findOne(id: number): Promise<Car> | null {
    return await this.carRepository.findOneBy({
      id,
    });
  }

  async findModelByMake(query_p: { make: string }): Promise<Car[]> {
    return await this.carRepository
      .createQueryBuilder('car')
      .select('DISTINCT car.model', 'model') // Use DISTINCT in the select statement
      .where('LOWER(car.make) = LOWER(:make)', { make: query_p.make })
      .getRawMany();
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

  async remove(id: number): Promise<any> {
    return await this.carRepository
      .createQueryBuilder()
      .delete()
      .from('cars')
      .where('id = :id', { id })
      .execute();
  }
}
