import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private configService: ConfigService,
        private readonly userService: UsersService
    ){
        super({
            secretOrKey: configService.get<string>('JWT_SECRET')!,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload): Promise<User> {

        const {id} = payload;

        const user = await this.userService.findOne(id);

        if (!user || !user.isActive) {
            throw new UnauthorizedException('User inactive');
        }

        return user;
    }

}