const Request = require('supertest');
const QS = require('qs');
const _ = require('lodash');
const fs = require('fs/promises');

const GeneralHelper = require('../../server/helpers/generalHelper');
const PokemonPlugin = require('../../server/api/pokemon');

let apiUrl;
let server;
let query;
let body;
let pokemon;
let pokemonId = 55;
let createdIds = [];

const getJSONParsedData = async () => {
  const studentJSON = await fs.readFile("./assets/db.json", "utf-8");
  return JSON.parse(studentJSON);
}
const writeDataToJSON = async (jsonData) => {
  await fs.writeFile("./assets/db.json", JSON.stringify(jsonData));
};

describe('Pokemon Json', () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer('/pokemon', PokemonPlugin);
  });

  afterAll(async () => {
    await server.close();
  });

  describe(`Cleanup before tests that use pokemon id ${pokemonId}`, () => {
    test("Do Cleanup data", async () => {
      let localData = await getJSONParsedData();

      localData.pokemons = localData.pokemons.filter(v => v.pokemonId != pokemonId);

      await writeDataToJSON(localData);
    });
  })

  describe('Get Pokemon List API', () => {
    beforeEach(() => {
      apiUrl = '/pokemon/list-pokemons';
      query = {

      };
      pokemon = "bulbasaur";
    });

    test('Should Return 200: Get All Pokemon from API without append limit', async () => {
      await Request(server)
        .get(apiUrl)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
          expect(res.body.length).toBe(20);
          const bulbasaur = _.find(res.body, (item) => item.name.toLowerCase() === pokemon);
          expect(!_.isEmpty(bulbasaur)).toBeTruthy();
        });
    });
    test('Should Return 200: Get All Pokemon from API with limit 10', async () => {
      query = {
        limit: 10
      }

      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
          expect(res.body.length).toBe(10);
          const bulbasaur = _.find(res.body, (item) => item.name.toLowerCase() === pokemon);
          expect(!_.isEmpty(bulbasaur)).toBeTruthy();
        });
    });
    test('Should Return 200: Get All Pokemon from API with limit 10 and offset from 20', async () => {
      query = {
        offset: 20,
        limit: 10,
      }
      pokemon = "spearow";

      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
          expect(res.body.length).toBe(10);
          const spearow = _.find(res.body, (item) => item.name.toLowerCase() === pokemon);
          expect(!_.isEmpty(spearow)).toBeTruthy();
        });
    });
    test('Should Return 200: Get All Pokemon from API from offset 20', async () => {
      query = {
        offset: 20
      }
      pokemon = "spearow";

      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
          expect(res.body.length).toBe(20);
          const spearow = _.find(res.body, (item) => item.name.toLowerCase() === pokemon);
          expect(!_.isEmpty(spearow)).toBeTruthy();
        });
    });
    test('Should Return 400: Get All Pokemon error offset not a number', async () => {
      query = {
        offset: "aaa"
      }

      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(400)
        .then((res) => {
          expect(!_.isArray(res.body)).toBeTruthy();
        });
    });
    test('Should Return 400: Get All Pokemon error limit not a number', async () => {
      query = {
        limit: "aaa"
      }

      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(400)
        .then((res) => {
          expect(!_.isArray(res.body)).toBeTruthy();
        });
    });
    test('Should Return 400: Get All Pokemon error offset not a number', async () => {
      query = {
        offset: "aaa"
      }

      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(400)
        .then((res) => {
          expect(!_.isArray(res.body)).toBeTruthy();
        });
    });
    test('Should Return 400: Get All Pokemon error unknown key query param', async () => {
      query = {
        dwadw: ""
      }

      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(400)
        .then((res) => {
          expect(!_.isArray(res.body)).toBeTruthy();
        });
    });
  });
  describe("Get Pokemon Detail API", () => {
    beforeEach(() => {
      apiUrl = '/pokemon/detail-pokemon';
      query = {
        id: 40
      };
    });

    test('Should Return 200: Get pokemon detail with id', async () => {
      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });
    test('Should Return 404: Get pokemon detail error unknown id', async () => {
      query = {
        id: 9999
      };
      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(404)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });
    test('Should Return 400: Get pokemon detail error with string in id', async () => {
      query = {
        id: "dadw"
      };
      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(400)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });
    test('Should Return 400: Get pokemon detail error with unknown key query param', async () => {
      query = {
        dwad: ""
      };
      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(400)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });
  });
  describe("Create Pokemon Data", () => {
    beforeEach(() => {
      apiUrl = '/pokemon/catch';
      body = {
        id: pokemonId
      };
      pokemon = "golduck";
    });

    test('Should Return 200: Catch Pokemon until catched with 50% chance catch rate and 30 max attempt', async () => {
      let maxAttemp = 30;
      let attempt = 0;
      let isCatched = false;

      while (attempt <= maxAttemp && !isCatched) {
        const res = await Request(server)
          .post(`${apiUrl}`)
          .send(body)
          .expect(200);

        const data = res.body;

        if (data.isSuccess) {
          isCatched = true;
          createdIds.push(data.insertedId);
          expect(data.nickname).toEqual(pokemon);
          break;
        }

        attempt++;
      }

      expect(isCatched).toBeTruthy();
    });

    test('Should Return 200: Catch same Pokemon until catched with 50% chance catch rate and 30 max attempt with first fibonacci', async () => {
      let maxAttemp = 30;
      let attempt = 0;
      let isCatched = false;

      while (attempt <= maxAttemp && !isCatched) {
        const res = await Request(server)
          .post(`${apiUrl}`)
          .send(body)
          .expect(200);

        const data = res.body;

        if (data.isSuccess) {
          isCatched = true;
          createdIds.push(data.insertedId);
          expect(data.nickname).toEqual(pokemon + "-0");
          break;
        }

        attempt++;
      }

      expect(isCatched).toBeTruthy();
    });

    test('Should Return 200: Catch same Pokemon until catched with 50% chance catch rate and 30 max attempt with next 3 fibonacci numbers', async () => {
      let maxAttemp = 60;
      let attempt = 0;
      let catchedNames = [];
      let fibonacciNums = [1, 1, 2]

      while (attempt <= maxAttemp && catchedNames.length < 3) {
        const res = await Request(server)
          .post(`${apiUrl}`)
          .send(body)
          .expect(200);

        const data = res.body;

        if (data.isSuccess) {
          expect(data?.nickname).toEqual(`${pokemon}-${fibonacciNums[catchedNames.length]}`);
          catchedNames.push(data?.nickname);
          createdIds.push(data?.insertedId);
          if (catchedNames.length === 3) break;
        }

        attempt++;
      }

      expect(!_.isEmpty(catchedNames)).toBeTruthy();
      expect(catchedNames.length).toBe(3);
    });

    test('Should Return 404: Catch with unknown pokemon id returns error 404', async () => {
      body = {
        id: 9999
      };

      await Request(server)
        .post(`${apiUrl}`)
        .send(body)
        .expect(404);
    });
    test('Should Return 400: Catch with string in id', async () => {
      body = {
        id: "adwa"
      };

      await Request(server)
        .post(`${apiUrl}`)
        .send(body)
        .expect(400);
    });
    test('Should Return 400: Catch with unknown key', async () => {
      body = {
        aaaaa: "adwa"
      };

      await Request(server)
        .post(`${apiUrl}`)
        .send(body)
        .expect(400);
    });
    test('Should Return 400: Catch undefined id', async () => {
      body = {

      };

      await Request(server)
        .post(`${apiUrl}`)
        .send(body)
        .expect(400);
    });
  });

  describe("Get All My Catched Pokemons", () => {
    beforeEach(() => {
      apiUrl = "/pokemon/my-pokemons";
      pokemon = "golduck";
    });

    test('Should Return 200: Get all my catched pokemons including last test catched', async () => {

      await Request(server)
        .get(`${apiUrl}`)
        .expect(200)
        .then(res => {
          const data = res.body;
          expect(data.length).toBeGreaterThan(1);

          createdIds.forEach(id => {
            const golduck = _.find(data, (item) => item.id == id);
            expect(golduck).toBeTruthy();
          })
        });
    });
  });
  describe("Rename Pokemon", () => {
    beforeEach(() => {
      apiUrl = "/pokemon/rename-pokemon";
      pokemon = "yazz";
    });

    test('Should Return 200: Renamed with last created pokemon ids and return name with and without fibonacci', async () => {
      const fibonacci = [0, 1, 1, 2];
      createdIds.sort((a, b) => a - b);

      for (let index = 0; index < createdIds.length; index++) {
        const e = createdIds[index];

        body = {
          id: e,
          name: pokemon
        }

        const res = await Request(server)
          .patch(`${apiUrl}`)
          .send(body)
          .expect(200);

        const data = res.body;

        expect(data?.name).toEqual(`${pokemon}${index > 0 ? `-${fibonacci[index - 1]}` : ""}`);
      }
    });
    test('Should Return 404: Renamed with unknown id', async () => {
      body = {
        id: 999,
        name: pokemon
      }
      await Request(server)
        .patch(`${apiUrl}`)
        .send(body)
        .expect(404);
    });
    test('Should Return 400: Renamed with string id', async () => {
      body = {
        id: "asdwad",
        name: pokemon
      }
      await Request(server)
        .patch(`${apiUrl}`)
        .send(body)
        .expect(400);
    });
    test('Should Return 400: Renamed with non alphanum name', async () => {
      body = {
        id: createdIds[0],
        name: "adw-@4a"
      }
      await Request(server)
        .patch(`${apiUrl}`)
        .send(body)
        .expect(400);
    });
    test('Should Return 400: Renamed with unknown body key', async () => {
      body = {
        id: createdIds[0],
        name: "adw-@4a",
        adwadwa: "adwa"
      }
      await Request(server)
        .patch(`${apiUrl}`)
        .send(body)
        .expect(400);
    });
  });
  describe("Release pokemon (delete)", () => {
    beforeEach(() => {
      apiUrl = "/pokemon/release-pokemon";
    });

    test('Should Return 200: Release all last catched pokemons', async () => {
      const checkIsPrime = num => {
        for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
          if (num % i === 0) return false;
        }
        return num > 1;
      }

      for (let index = 0; index < createdIds.length; index++) {
        const element = createdIds[index];
        let maxAttemp = 20;
        let attempt = 0;
        let isDeleted = false;

        body = {
          id: element
        }

        while (attempt <= maxAttemp && !isDeleted) {
          const res = await Request(server)
            .delete(`${apiUrl}`)
            .send(body)
            .expect(200);

          const data = res.body;
          const isPrime = data.isPrime;
          const number = data.number;

          expect(isPrime === checkIsPrime(number)).toBeTruthy();

          if (data.isPrime) {
            isDeleted = true;
            break;
          }
          attempt++;
        }
      }
    });
    test('Should Return 404: Release same as last released and return error 404 not found for finding non-existing ids', async () => {
      for (let index = 0; index < createdIds.length; index++) {
        const element = createdIds[index];
        body = {
          id: element
        }

        await Request(server)
          .delete(`${apiUrl}`)
          .send(body)
          .expect(404)
      }
    });
    test('Should Return 400: Release no keys in request body', async () => {
      body = {

      }

      await Request(server)
        .delete(`${apiUrl}`)
        .expect(400)
    });
    test('Should Return 400: Release with string in id key', async () => {
      body = {
        id: "adwa"
      }

      await Request(server)
        .delete(`${apiUrl}`)
        .expect(400)
    });
    test('Should Return 400: Release with unknown key', async () => {
      body = {
        dwawadelete: "adwa"
      }

      await Request(server)
        .delete(`${apiUrl}`)
        .expect(400)
    });
  });
});