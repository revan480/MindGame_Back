import {
  BadRequestException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { Game, Player } from 'src/sockets/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userFound = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    if (userFound)
      throw new MethodNotAllowedException(
        `User with email ${createUserDto.email} is already registered`,
      );

    const user = this.usersRepository.create({
      ...createUserDto,
      username: createUserDto.username,
    });

    if (!user) throw new BadRequestException('User could not be created');

    return await this.usersRepository.save(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({where: { email }});

    if (!user)
      throw new NotFoundException(`User with email ${email} was not found`);

    return user;
  }


  async validateUsername(username: string) {
    if(username.length === 0){
      throw new ForbiddenException('Username is empty');
    }
    const user = await this.usersRepository.findOneBy({username});
    if(!user){
      return true;
    }
    return false;
  }

  async getUserInfo(user: User) {
    return await this.findOneByEmail(user.email);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
