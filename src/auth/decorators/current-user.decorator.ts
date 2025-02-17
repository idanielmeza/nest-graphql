import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { RolesEnum } from "../enums/roles.enums";
import { User } from "src/users/entities/user.entity";


export const CurrentUser = createParamDecorator( 
    (roles : RolesEnum[] = [], context: ExecutionContext) => {

    const ctx = GqlExecutionContext.create(context);

    const user : User = ctx.getContext().req.user;

    if( !user ) {
        throw new InternalServerErrorException('Token not exists')
    }

    if(roles && roles.length){
        
        const hasRole = roles.some(role => user.roles?.includes(role));
        if (!hasRole) {
            throw new ForbiddenException('User does not have the required roles');
        }

    }

    return user;

})