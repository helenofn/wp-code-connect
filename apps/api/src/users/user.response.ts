import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Ada Lovelace' })
  name: string;

  @ApiProperty({ format: 'email', example: 'ada@example.com' })
  email: string;

  @ApiProperty({ example: 'ada' })
  username: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}
