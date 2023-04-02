import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

import { DbService } from '../src/db/db.service';
import { AppModule } from '../src/app.module';

describe('App e2e', () => {
  let app: INestApplication;
  let mongo: DbService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);

    mongo = app.get(DbService);
    await mongo.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3000');
  });
  afterAll(async () => {
    await app.close();
  });
  describe('auth', () => {
    let user = { email: 'e2e@e.com', password: '123456' };
    describe('signup', () => {
      it('Should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(user)
          .expectStatus(201);
      });
      it('signup without email: fail', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: user.password })
          .expectStatus(400);
      });
      it('signup without password: fail', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: user.email })
          .expectStatus(400);
      });
      it('signup without body: fail', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
    });
    describe('signin', () => {
      it('Should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(user)
          .stores('accessToken', 'data.access_token')
          .expectStatus(200);
      });
      it('signin without email: fail', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: user.password })
          .expectStatus(400);
      });
      it('signin without password: fail', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: user.email })
          .expectStatus(400);
      });
      it('signin without body: fail', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });
    });
  });
  describe('user', () => {
    describe('get me', () => {
      it('current user data: pass', () => {
        return pactum
          .spec()
          .get('/user/me')
          .withHeaders({ accesstoken: '$S{accessToken}' })
          .expectStatus(200);
      });
    });
    describe('edit user', () => {
      it('should update user', () => {
        let userBody = {
          email: 'e2e@e.com',
          first_name: 'Sayeem',
        };
        return pactum
          .spec()
          .patch('/user/')
          .withHeaders({ accesstoken: '$S{accessToken}' })
          .withBody(userBody)
          .expectStatus(200);
      });
    });
  });
  describe('bookmark', () => {
    describe('get empty bookmarks', () => {
      it('gets empty bookmark list', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({ accesstoken: '$S{accessToken}' })
          .expectStatus(200);
      });
    });
    describe('create bookmark', () => {
      it('creates a bookmark', () => {
        let bookmarkBody = {
          title: 'Nest Js Tutorial',
          link: 'https://www.youtube.com/watch?v=GHTA143_b-s',
          description: 'First Nest js tutorial',
        };
        return pactum
          .spec()
          .post('/bookmark')
          .withHeaders('accesstoken', '$S{accessToken}')
          .withBody(bookmarkBody)
          .stores('bookmarkId', 'data._id')
          .expectStatus(201);
      });
    });
    describe('get bookmarks', () => {
      it('gets list bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({ accesstoken: '$S{accessToken}' })
          .expectStatus(200);
      });
    });
    describe('get bookmark by id', () => {
      it('gets bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ accesstoken: '$S{accessToken}' })
          .expectStatus(200);
      });
    });
    describe('update bookmark', () => {
      it('updates bookmark', () => {
        let bookmarkBody = {
          title: 'NestJs Tutorial',
        };
        return pactum
          .spec()
          .patch('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ accesstoken: '$S{accessToken}' })
          .withBody(bookmarkBody)
          .expectStatus(200);
      });
    });
    describe('delete bookmark', () => {
      it('deletes bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ accesstoken: '$S{accessToken}' })
          .expectStatus(204);
      });
      it('gets empty bookmark list', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({ accesstoken: '$S{accessToken}' })
          .expectStatus(200);
      });
    });
  });
});
