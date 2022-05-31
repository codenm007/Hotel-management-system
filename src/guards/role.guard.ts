import { CanActivate, ExecutionContext, Injectable, Type } from "@nestjs/common";
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
        const token = request.headers["authorization"].slice(7);
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