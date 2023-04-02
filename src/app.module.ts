import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DbModule,  //might become configs module later
    ConfigModule.forRoot({ isGlobal: true }),
    //ModelModule
    AuthModule,
    UserModule,
    BookmarkModule,
    //
  ],
})
export class AppModule {}
