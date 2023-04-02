import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GetUser } from '../../src/auth/decorator';
import { JwtGuard } from '../../src/auth/guard';
import { UpdateUserDto, UserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('me')
  getMe(@GetUser() user: UserDto) {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Patch()
  updateUser(@GetUser('_id') userId: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(userId, body);
  }
}
