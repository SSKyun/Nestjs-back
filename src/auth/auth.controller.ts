import { GetUser } from './get-user.decorator';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from './guard/resreshToken.guard';

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
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto, @Res({passthrough : true}) res : Response): Promise<{accessToken : string}>{
        return this.authService.signIn(authCredentialsDto,res);

    }
    @Post('/logout')
    logout(@Req() req: Request, @Res() res: Response): any {
    res.cookie('refreshToken', '', {
        maxAge: 0,
        httpOnly : true
    });
    return res.send({
        message: 'success'
    })
}

    @Get('refresh')
    refreshTokens(@Req() req: Request) {
      return this.authService.refreshTokens(req);
    }

    @Get('/')
    @UseGuards(AuthGuard())
    authCheck(@GetUser() user: User){
        console.log(user);
        return user
    }
    
}
