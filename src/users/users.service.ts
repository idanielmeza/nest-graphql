import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SingupInput } from 'src/auth/dto/inputs/singup.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { RolesArgs } from './dto/args/roles.arg';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  )
  {}

  private readonly logger = new Logger(UsersService.name);

  async create(createUser: SingupInput) {
    
    try {
      
      const newUser = this.userRepository.create(createUser);
      const hash = await argon2.hash(newUser.password);
      newUser.password= hash;
      return await this.userRepository.save(newUser)

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('INTERNAL SERVER ERROR')
    }

  }

  findAll({roles}: RolesArgs) {

    if(roles){
      return this.userRepository.createQueryBuilder('user')
        .where('ARRAY[roles] && ARRAY[:...roles]', {roles})
        .getMany();
    }

    return this.userRepository.find()
  }

  async findOne(id: string) : Promise<User | null> {
    return this.userRepository.findOneBy({id});
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  findByEmail(email: string) : Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        email
      }
    })
  }

}
