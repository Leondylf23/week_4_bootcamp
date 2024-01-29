const Request = require('supertest');
const QS = require('qs');
const _ = require('lodash');

const GeneralHelper = require('../../server/helpers/generalHelper');
const PokemonPlugin = require('../../server/api/pokemon');

let apiUrl;
let server;
let query;

describe('Pokemon Json', () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer('/pokemon', PokemonPlugin);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('List', () => {
    beforeEach(() => {
      apiUrl = '/pokemon/list';
      query = { 
        name: "bulbasaur"
      };
    });

    test('Should Return 200: Get All Pokemon', async () => {
      await Request(server)
        .get(apiUrl)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
          expect(res.body.length).toBe(3);
          const bulbasaur = _.find(res.body, (item) => item.name.toLowerCase() === 'bulbasaur');
          expect(!_.isEmpty(bulbasaur)).toBeTruthy();
        });
    });
    
    test('Should Return 200: Get Specific Pokemon with Result', async () => {
      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
          expect(res.body.length).toBe(1);
          const bulbasaur = _.find(res.body, (item) => item.name.toLowerCase() === 'bulbasaur');
          const ivysaur = _.find(res.body, (item) => item.name.toLowerCase() === 'ivysaur');
          expect(!_.isEmpty(bulbasaur)).toBeTruthy();
          expect(_.isEmpty(ivysaur)).toBeTruthy();
        });
    });

    test('Should Return 200: Get Specific Pokemon without Result', async () => {
      query.name = 'pikachu';
      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(200)
        .then((res) => {
          expect(_.isEmpty(res.body)).toBeTruthy();
          expect(res.body.length).toBe(0);
          const bulbasaur = _.find(res.body, (item) => item.name.toLowerCase() === 'bulbasaur');
          expect(_.isEmpty(bulbasaur)).toBeTruthy();
        });
    });

    test('Should Return 400: Invalid Query Param', async () => {
      query = {
        randomKey: "randomVal"
      };
      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(400);
    });
  });
});