import { IsArray, IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { SingupInput } from 'src/auth/dto/inputs/singup.input';
import { RolesEnum } from 'src/auth/enums/roles.enums';

@InputType()
export class UpdateUserInput extends PartialType(SingupInput) {
  @Field(() =>  ID)
  @IsUUID()
  id: string;

  @Field(() => RolesEnum, { nullable: true })
  @IsArray()
  @IsEnum(RolesEnum)
  @IsOptional()
  roles?: RolesEnum

  @Field(() => Boolean, {nullable: true})
  @IsBoolean()
  @IsOptional()
  isAcitve?: boolean;

}
