import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString, MinLength } from "class-validator";

@InputType()
export class SingupInput {
    
    @Field(() => String)
    @IsEmail()
    email: string;

    @Field(() => String)
    @IsString()
    fullName: string;

    @Field(() => String)
    @MinLength(6)
    password: string;
}