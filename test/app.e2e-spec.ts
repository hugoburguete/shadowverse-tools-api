import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Card } from '../src/card/entities/card.entity';
import CardModelFactory from '../src/common/test-utils/card.model.factory';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken(Card))
      .useValue(CardModelFactory)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Shadowverse API Tools');
  });

  it('pings the card page', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query:
          '{\n  cards {\n    edges {\n      cursor\n      node {\n        id\n      }\n    }\n    totalCount\n    pageInfo {\n      startCursor\n      endCursor\n      hasNextPage\n    }\n  }\n}\n',
      })
      .expect(200);
    expect(response.body.data.cards.edges[0].node.id).toEqual(1);
  });
});
