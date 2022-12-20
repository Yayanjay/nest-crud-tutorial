/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
    
  }

  create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      username: createUserDto.username,
      password: createUserDto.password, 
      email: createUserDto.email, 
      created_at: new Date(),
      updated_at: new Date()
    });
    return this.userRepository.save(newUser);
    
  }

  findAll() {
    return this.userRepository.find();
  }

  findById(id: string) {
    return this.userRepository.findOneBy({id:id});
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(
      {id},
      {...updateUserDto}
    );
  }

  remove(id: string) {
    return this.userRepository.delete({id});
  }
}
