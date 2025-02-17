import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SingupInput } from './dto/inputs/singup.input';
import { AuthReponse } from './dto/types/auth-response.type';
import { LoginInput } from './dto/inputs/login.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';



@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  
  @Mutation(() => AuthReponse)
  async singup(
    @Args('singupInput') singup: SingupInput
  ){
    return this.authService.singup(singup);
  }

  @Mutation(() => AuthReponse)
  async login(
    @Args('loginInput') login : LoginInput
  ){
    return this.authService.login(login);
  }

  @Query(() => AuthReponse)
  @UseGuards( JwtAuthGuard )
  renewToken(
    @CurrentUser() user: User
  ){
    return this.authService.renewToken(user);
  }

}
