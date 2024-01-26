import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entites/user.entity';
import { Repository } from 'typeorm';

type OmitKeys<T, K extends (keyof T)[]> = Omit<T, K[number]>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(payload: OmitKeys<User, ['id', 'isActive']>): Promise<User> {
    return this.userRepository.save(payload);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
        isActive: 1,
      },
    });
  }
}
