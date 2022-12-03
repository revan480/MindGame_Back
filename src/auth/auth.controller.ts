import { Body,Controller,HttpCode,HttpStatus,Post, Req, UseGuards, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { Request } from 'express';
import { RtGuard } from 'src/common/guards';
import { getCurrentUser } from 'src/common/decorators';
import { getCurrentUserId } from 'src/common/decorators/get-current-user-id.decarator';
import { Public } from 'src/common/decorators/public.decarator';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }
    @Public()
    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signupLocal(dto);
    }

    @Public()
    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signinLocal(dto);
    }

    
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@getCurrentUserId() userId: number) {
        return this.authService.logout(userId);
    }
    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(
    @getCurrentUserId() userId: number,
    @getCurrentUser('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(
            userId, refreshToken
        );
    }
}
