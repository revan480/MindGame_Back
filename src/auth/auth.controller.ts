/* eslint-disable prettier/prettier */
import { User } from '@prisma/client';
import { RefreshTokenDto } from './dto/rt.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Body,Controller,HttpCode,HttpStatus,Post, Query, Req, UseGuards, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, EmailDto, LogoutDto } from './dto';
import { Tokens } from './types';
import { RtGuard } from 'src/common/guards';
import { getCurrentUser } from 'src/common/decorators';
import { getCurrentUserId } from 'src/common/decorators/get-current-user-id.decarator';
import { Public } from 'src/common/decorators/public.decarator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private mailService:MailerService) {
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

    @Public()
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Body() logoutDto: LogoutDto) {
        return this.authService.logout(logoutDto);
    }
    
    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return await this.authService.refreshTokens(refreshTokenDto);
    }
    

}