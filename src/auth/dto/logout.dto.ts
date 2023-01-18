/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";

export class LogoutDto {
    @ApiProperty({
        description: 'Write your user id',
        example: '1'
    })
    userId: number;
}