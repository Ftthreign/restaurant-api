import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['restaurants', 'reviews'],
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const { password, role, ...data } = updateUserDto;

    this.userRepository.merge(user, data);

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const res = await this.userRepository.delete(id);

    if (res.affected === 0)
      throw new NotFoundException(`User with ID ${id} not found`);
  }
}
