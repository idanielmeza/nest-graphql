import { registerEnumType } from "@nestjs/graphql";

export enum RolesEnum {
    ADMIN = 'ADMIN',
    USER = 'USER',
    SUPER_ADMIN = 'SUPER_ADMIN'
}

registerEnumType(RolesEnum, {name: 'rolesEnum'})