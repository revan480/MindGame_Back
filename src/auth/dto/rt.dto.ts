/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto{

    userId:number;

    email:string;

    @ApiProperty({
        description: 'The old refresh token of the user',
        example: 'Your refresh token'
    })
    refreshToken: string;
}