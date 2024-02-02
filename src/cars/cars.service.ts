import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../entites/car.entity';
import { Between, FindManyOptions, Like, Raw, Repository } from 'typeorm';

export interface ExtendedCar extends Car {
  count?: number;
}

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car) private readonly carRepository: Repository<Car>,
  ) {}

  async create(payload: Car): Promise<{ status: string; data: Car }> {
    try {
      const save = await this.carRepository.save(payload);
      return { status: 'success', data: save };
    } catch (error) {
      return { status: 'error', data: null };
    }
  }

  async update(
    id: number,
    payload: Car,
  ): Promise<{ status: string; data: Car }> {
    const save = await this.carRepository.save({
      id,
      ...payload,
    });

    try {
      const save = await this.carRepository.save(payload);
      return { status: 'success', data: save };
    } catch (error) {
      return { status: 'error', data: null };
    }
  }

  async findAll(
    queryParams: any,
  ): Promise<{ data: ExtendedCar[]; total: number }> {
    let {
      page = 1,
      limit = 5,
      sortBy = 'make',
      sortOrder,
      ...filters
    } = queryParams;

    let skip = (page - 1) * limit;

    const whereClause: Record<string, any> = {};

    let where = [];

    if (filters && filters.make) {
      skip = 0;
      whereClause.make = filters.make;
    }

    if (filters && filters.model) {
      skip = 0;
      whereClause.model = filters.model;
    }

    if (filters && filters.year) {
      skip = 0;
      whereClause.year = filters.year;
    }

    if (filters && filters.from !== undefined && filters.to !== undefined) {
      skip = 0;
      whereClause.price = Between(filters.from, filters.to);
    }

    const findOptions: FindManyOptions<Car> = {
      skip,
      take: limit,
      order: sortBy ? { [sortBy]: sortOrder || 'ASC' } : undefined,
      where: whereClause,
    };

    const [data, total] = await this.carRepository.findAndCount(findOptions);

    return { data: data as ExtendedCar[], total };
  }

  async findCarsBySearchTerm(
    search_term: any,
  ): Promise<{ data: ExtendedCar[]; total: number }> {
    let { search_term: term } = search_term;

    const isYear = /^\d{4}$/.test(term);

    const whereConditions = isYear
      ? [
          {
            year: term,
          },
        ]
      : [
          {
            make: Raw((alias) => `LOWER(${alias}) LIKE LOWER('%${term}%')`),
          },
          {
            model: Raw((alias) => `LOWER(${alias}) LIKE LOWER('%${term}%')`),
          },
        ];

    // console.log(typeof parseInt(term));
    const [data, total] = await this.carRepository.findAndCount({
      where: whereConditions,
    });

    return { data: data as ExtendedCar[], total };
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
