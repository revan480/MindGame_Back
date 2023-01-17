/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto{
    @ApiProperty({
        description: 'The old refresh token of the user',
        example: 'Your refresh token'
    })
    oldRefreshToken: string;
}