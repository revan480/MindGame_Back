/* eslint-disable prettier/prettier */

import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { PrismaModule } from './prisma/prisma.module';

@Module({

  imports: [AuthModule, PrismaModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtps://postmaster@sandbox578094903e9a46f6bb11c60dbea01e1a.mailgun.org',
        auth:{
          user:'api',
          pass:'7e360ebca8e5d4509686a3fb4104a204-48d7d97c-dc9818fe'
        }
    }})],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
  controllers: [],
})
export class AppModule {}
