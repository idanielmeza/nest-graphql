import { ArgsType, Field } from "@nestjs/graphql";
import { IsArray, IsEnum } from "class-validator";
import { RolesEnum } from "src/auth/enums/roles.enums";

@ArgsType()
export class RolesArgs {
    
    @Field( ()=> [RolesEnum], {nullable: true} )
    @IsArray()
    @IsEnum(RolesEnum)    
    roles: RolesEnum[] = [];
}