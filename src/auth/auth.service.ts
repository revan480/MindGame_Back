/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
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
        // If not, send the email to the user with a link to verify the email
        // await this.sendEmail(dto);
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
    async logout(userID:number) {
        await this.prisma.user.updateMany({
            where: {
                id: userID,
                hashedRt: {
                    not: null,
                }
            },
            data: {
                hashedRt: null,
            },

        });
        
    }
    async refreshTokens(userID: number, rt: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userID,
            },
        });
        if (!user || !user.hashedRt) throw new ForbiddenException('Invalid credentials');
        const rtMatches = await bcrypt.compare(rt, user.hashedRt);
        if (!rtMatches) throw new ForbiddenException('Invalid credentials');
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
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
    async sendEmail(email: EmailDto) {
        const email_send = await this.mailService.sendMail({
            to: email.email,
            from: 'Mailgun Sandbox',
            subject: 'Testing Nest MailerModule ✔',
            text: 'welcome',
            html: '<b>welcome</b>',
        });
        console.log(email_send);
        return email_send;
    }
}
