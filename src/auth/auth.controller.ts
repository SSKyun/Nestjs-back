import { AccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { GetUser } from './get-user.decorator';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Put, Query, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
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
    signUp(@Body(ValidationPipe) authcredentialsDto : AuthCredentialsDto){ //promise<void> 삭제
            return this.authService.signUp(authcredentialsDto);
    }

    @Post('/signin')
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

    @Get('/refresh')
    refreshTokens(@Req() req: Request) {
      return this.authService.refreshTokens(req);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    authCheck(@Req() req:Request):Promise<User>{
        return this.authService.getAllUsers(req.user);
    }

    @Delete('/:id') //유저 삭제는 관리자 문의로
    @UseGuards(AccessTokenGuard)
    async deleteUser(@Param('id',ParseIntPipe) id: number) : Promise<void>{
        await this.authService.deleteUser(id);
    }

    @Patch('/:id')
    updateUser(@Param('id',ParseIntPipe)id:number,@Body()user:User){
        return this.authService.updateUser(id,user);
    }

}
