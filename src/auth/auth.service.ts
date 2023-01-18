/* eslint-disable prettier/prettier */
import { RefreshTokenDto } from './dto/rt.dto';
import { LogoutDto } from './dto/logout.dto';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthDto, EmailDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailerService
        ) {}
    async signupLocal(dto: AuthDto): Promise<Tokens> {
        // First, check if the user already exists
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (user) {
            throw new ForbiddenException('User already exists');
        }

        // Then, create the user in the database
        const hash = await bcrypt.hash(dto.password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
            },
        });
        // Finally, return the tokens
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);
        return tokens;
}

    async signinLocal(dto: AuthDto): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) 
            throw new ForbiddenException('Invalid credentials');
            const passwordMatches = await bcrypt.compare(dto.password, user.hash);
            if (!passwordMatches)
            throw new ForbiddenException('Invalid credentials');

            const tokens = await this.getTokens(user.id, user.email);
            await this.updateRtHash(user.id, tokens.refresh_token);
            return tokens;


    }
    
    async logout(logoutDto: LogoutDto){
        const { userId } = logoutDto;
          await this.prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              hashedRt: null,
            },
          });
          return 'Successfully logged out';
    }


    // async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    //     const user = await this.prisma.user.findUnique({
    //         where: {
    //             id: userId,
    //         },
    //     });
    //     if (!user || !user.hashedRt) {
    //         throw new ForbiddenException('Invalid credentials');
    //     }
    //     const rtMatches = await bcrypt.compare(refreshToken, user.hashedRt);
    //     if (!rtMatches) {
    //         throw new ForbiddenException('Invalid credentials');
    //     }
    //     const tokens = await this.getTokens(user.id, user.email);
    //     await this.updateRtHash(user.id, tokens.refresh_token);
    //     return tokens;
    // }
    
    async refreshTokens(refreshTokenDto:RefreshTokenDto){
        // const { refreshToken } = refreshTokenDto;
        // const user = await this.prisma.user.findUnique({
        //     where: {
        //         id: refreshTokenDto.userId,
        //     },
        //     select: { id: true }
        // });
        // if (!user) {
        //     throw new UnauthorizedException('Invalid credentials');
        // }
        // const tokens = await this.getTokens(user.id, refreshTokenDto.email);
        // await this.updateRtHash(user.id, tokens.refresh_token);
        // return tokens;
        return "Salam";
    }
    

    async updateRtHash(userID: number, rt: string) {
        const hash = await this.hashData(rt);
        await this.prisma.user.update({
            where: {
                id: userID,
            },
            data: {
                hashedRt: hash,
            },
        });
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }
    async getTokens(userID: number, email: string) {
        const[at, rt] = await Promise.all([
            
            this.jwtService.signAsync(
                {
                    sub: userID,
                    email,
                },
                {
                    secret: 'at-secret',
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userID,
                    email,
                },
                {
                    secret: 'rt-secret',
                    expiresIn: '7d',
                },
            ),
        ])
        return {
            access_token: at,
            refresh_token: rt,

    };
}
}
