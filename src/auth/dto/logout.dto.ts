/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";

export class LogoutDto {
    @ApiProperty({ description: 'User id' })
    userId: number;

    @ApiProperty({ description: 'Refresh token' })
    refreshToken: string;
}