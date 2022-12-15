import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EmailDto{
    
        @ApiProperty({
            description: 'Write your email',
            example: 'test@test.com'
        })
        @IsNotEmpty()
        @IsString()
        email: string ;
}