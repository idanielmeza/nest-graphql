import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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
        .leftJoinAndSelect('user.lastUserUpdated', 'lastUserUpdated')
        .getMany();
    }

    return this.userRepository.find({relations: {lastUserUpdated: true}})
  }

  async findOne(id: string) : Promise<User | null> {
    return this.userRepository.findOneBy({id});
  }

  async update(id: string, updateUserInput: UpdateUserInput, loggedUser: User) {
    
    const user = await this.findOne(id);

    if(!user) throw new NotFoundException('user not found');

    for(const key of Object.keys(user)){

        if(key === undefined || key === null || key === "id") continue;

        if (updateUserInput.hasOwnProperty(key)) {

            if(key === "password"){
              user[key] = await argon2.hash(updateUserInput.password!);
            }else
              user[key] = updateUserInput[key];
        }

    }

    user.lastUserUpdated = loggedUser;
    user.lastUpdated = new Date();

    await this.userRepository.save(user);

    return user;

  }

  async remove(id: string, loggedUser: User) {
    const user = await this.findOne(id)

    if(!user) throw new NotFoundException('user not found');

    user.isActive = !user.isActive;
    user.lastUserUpdated = loggedUser;
    user.lastUpdated = new Date();

    await this.userRepository.save(user);

    return user;

  }

  findByEmail(email: string) : Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        email
      }
    })
  }

}
