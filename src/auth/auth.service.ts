import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SingupInput } from './dto/inputs/singup.input';
import { AuthReponse } from './dto/types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { LoginInput } from './dto/inputs/login.input';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {


  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ){}

  private readonly logger = new Logger(AuthService.name)
  
  async singup(data: SingupInput) : Promise<AuthReponse>{

    const user = await this.userService.create(data);

    const token = this.jwtService.sign({ id: user.id });

    return {
      token,
      user
    }

  }

  async login(data: LoginInput) : Promise<AuthReponse> {
    
    const user = await this.userService.findByEmail(data.email);

    if(!user) throw new NotFoundException('user not found');
    
    if(await argon2.verify(user.password, data.password)){
      const token = this.jwtService.sign({ id: user.id });

      return {
        token,
        user
      }

    }
    else throw new ConflictException('invalid password');

  }

  renewToken(user: User) : AuthReponse {

    return {
      token: this.jwtService.sign({ id: user.id}),
      user
    }

  }

}
