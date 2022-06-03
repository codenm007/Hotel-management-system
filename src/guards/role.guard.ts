import { CanActivate, ExecutionContext, Injectable, Type,BadRequestException } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Role } from "../users/dtos/User.dto";
import { JwtService } from '@nestjs/jwt';

export function RoleGuard(role: Role): Type<CanActivate>{
   @Injectable()
    class RoleGuardMixin extends JwtAuthGuard{
        constructor(
            private jwtService: JwtService
            ) {
                super();
            }

      async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        let token = request.headers["authorization"];
        if(!token) {
          throw new BadRequestException('Please pass token ')
        }
        token = token.slice(7);
        const user = this.jwtService.decode(token);
        if (user && user['role']) {
          return user['role'] === role;
        }
        return false;
      }
    }
   
    return RoleGuardMixin;
  }
   
  export default RoleGuard;