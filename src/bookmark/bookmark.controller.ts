import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from '../../src/auth/guard';
import { GetUser } from '../../src/auth/decorator';
import { BookmarkFilterDto, UpdateBookmarkDto } from './dto';
import { CreateBookmarkDto } from './dto/create.dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  createBookmark(
    @GetUser('_id') userId: string,
    @Body() body: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, body);
  }

  @Get()
  getListBookmark(
    @GetUser('_id') userId: string,
    @Query() query: BookmarkFilterDto,
  ) {
    return this.bookmarkService.getListBookmark({ userId, ...query });
  }

  @Get(':id')
  getBookmark(@GetUser('_id') userId: string, @Param('id') bookmarkId: string) {
    return this.bookmarkService.getBookmark(userId, bookmarkId);
  }

  @Patch(':id')
  updateBookmark(
    @GetUser('_id') userId: string,
    @Param('id') bookmarkId: string,
    @Body() body: UpdateBookmarkDto,
  ) {
    this.bookmarkService.updateBookmark(userId, bookmarkId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBookmark(
    @GetUser('_id') userId: string,
    @Param('id') bookmarkId: string,
  ) {
    this.bookmarkService.deleteBookmark(userId, bookmarkId);
  }
}
