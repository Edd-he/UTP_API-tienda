import { UsersService } from '@modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUserSession } from '@auth/interfaces/user-session.interface';
import { SignInDto } from './dto/signIn.dto';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UsersService, jwtService: JwtService);
    register(): Promise<void>;
    signIn({ correo, contraseña }: SignInDto): Promise<{
        user: IUserSession;
        tokens: {
            access: string;
            refresh: string;
        };
    }>;
    signOut(): Promise<void>;
    refresh(user: IUserSession): Promise<{
        access: string;
        refresh: string;
    }>;
}
