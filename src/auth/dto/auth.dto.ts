import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthDto{
    @ApiProperty({
        description: 'Write your email',
        example: 'test@test.com'
    })
    @IsNotEmpty()
    @IsString()
    email: string ;

    @ApiProperty({
        description: 'Write your password',
        example: '123456'
    })
    @IsNotEmpty()
    @IsString()
    password: string;
    
}