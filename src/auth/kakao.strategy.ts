// import { AuthService } from './auth.service';
// import { Strategy } from 'passport-kakao';
// import { PassportStrategy } from '@nestjs/passport';
// import * as config from 'config';
// import { UserKakaoDto } from './dto/user.kakao.dto';

// const kakaoConfig = config.get('kakao');

// export class KakaoStrategy extends PassportStrategy(Strategy){
//     constructor(private authService : AuthService){
//         super({
//             clientID : kakaoConfig.clientID,
//             callbackURL : kakaoConfig.callbackURL,
//         });
//     }
//     async validate(accessToken:string,refreshToken:string,profile:any,done:any){
//         const user_nick = profile._json.nickname;
//         const user_profile = {
//             user_nick,
//         };
//         const user = await this.authService.vali
        
//     }
    
// }

