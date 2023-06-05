import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { ParcelService } from '../services/parcel.service';
import { ParcelModule } from '../modules/parcel.module';
import { ConfigModule } from '@nestjs/config';

describe('ParcelController', () => {
  let app: INestApplication;
  let repository;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.test.env' }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
          synchronize: true,
        }),
        ParcelModule,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    repository = await moduleRef.get(ParcelService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await repository.parcelRepository.query('DELETE FROM parcel');
  });

  // NOTE: test data (would love to move it to a different file but I'm not sure where it will be most suited)
  const parcelData1 = {
    sku: 'SKU_01',
    description: 'Kinder bueno, white chocolate.. enjoy!',
    streetAddress: '25 rue de la joie',
    town: 'China town',
    country: 'Estonia',
    deliveryDate: new Date(),
  };
  const parcelData2 = {
    sku: 'SKU_02',
    description: 'Camel blue, Camel Yellow.. Quite smoking!',
    streetAddress: '420 you know',
    town: 'Africa town',
    country: 'Tunisia',
    deliveryDate: new Date(),
  };

  describe('POST /parcels', () => {
    it('should create a new parcel', async () => {
      const response = await request(app.getHttpServer())
        .post('/parcels')
        .send(parcelData1)
        .expect(201);

      // we send a date but we get back an ISO date (string);
      parcelData1.deliveryDate = parcelData1.deliveryDate.toISOString() as any;

      expect(response.body).toMatchObject(parcelData1);
    });

    it('should return 400 if fields are missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/parcels')
        .send({ ...parcelData1, country: undefined })
        .expect(400);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        message: 'Required fields are missing.',
        status: 'failure',
        missingFields: ['country'],
      });
    });

    it('should return 400 if duplicate SKU is provided', async () => {
      await request(app.getHttpServer())
        .post('/parcels')
        .send(parcelData1)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/parcels')
        .send(parcelData1);
      // .expect(400);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        message: 'Duplicate SKU are not allowed.',
        status: 'failure',
      });
    });
  });

  describe('GET /parcels', () => {
    it('should return all parcels sorted by delivery date ascending and Estonia first', async () => {
      await Promise.all([
        request(app.getHttpServer())
          .post('/parcels')
          .send(parcelData2)
          .expect(201),
        request(app.getHttpServer())
          .post('/parcels')
          .send(parcelData1)
          .expect(201),
      ]);

      const response = await request(app.getHttpServer())
        .get('/parcels')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].country).toBe('Estonia');
      expect(response.body[1].country).toBe('Tunisia');
    });

    it('should return only parcels for a specific country', async () => {
      await Promise.all([
        request(app.getHttpServer())
          .post('/parcels')
          .send(parcelData2)
          .expect(201),
        request(app.getHttpServer())
          .post('/parcels')
          .send(parcelData1)
          .expect(201),
      ]);

      const response = await request(app.getHttpServer())
        .get('/parcels')
        .query({ country: 'Estonia' })
        .expect(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].country).toBe('Estonia');
    });

    it('should return only parcels with a specific description', async () => {
      await Promise.all([
        request(app.getHttpServer())
          .post('/parcels')
          .send(parcelData2)
          .expect(201),
        request(app.getHttpServer())
          .post('/parcels')
          .send(parcelData1)
          .expect(201),
      ]);

      const response = await request(app.getHttpServer())
        .get('/parcels')
        .query({ description: 'kinder' })
        .expect(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].description).toBe(parcelData1.description);
    });

    it('should return 400 if an unknown query parameter is provided', async () => {
      await Promise.all([
        request(app.getHttpServer())
          .post('/parcels')
          .send(parcelData2)
          .expect(201),
        request(app.getHttpServer())
          .post('/parcels')
          .send(parcelData1)
          .expect(201),
      ]);
      const response = await request(app.getHttpServer())
        .get('/parcels')
        .query({ weirdParameter: 'Booooo' })
        .expect(400);
      expect(response.body.message).toBe(
        'Only `country` and `description` fields are allowed in the query parameters',
      );
    });
  });
});
