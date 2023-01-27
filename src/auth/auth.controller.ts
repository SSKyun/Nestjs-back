import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService
    ){}
//localhost:8000/auth/signup
    @Post('/signup')
    signUp(@Body() authcredentialsDto : AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authcredentialsDto);
    }
}
