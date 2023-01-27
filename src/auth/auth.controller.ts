import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService
    ){}
//localhost:8000/auth/signup
    @Post('/signup')
    signUp(@Body(ValidationPipe) authcredentialsDto : AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authcredentialsDto);
    }

    @Post('signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken : string}>{
        return this.authService.signIn(authCredentialsDto);
    }
}
