const Request = require('supertest');
const QS = require('qs');
const _ = require('lodash');

const GeneralHelper = require('../../server/helpers/generalHelper');
const StudentPlugin = require('../../server/api/students');

let apiUrl;
let server;
let query;
let dataNew;
let queryUpdate;
let queryDelete;
let latestCreatedId = 0;

describe('Travel Ticket Json', () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer('/students', StudentPlugin);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('Get data', () => {
    beforeEach(() => {
      apiUrl = '/students/list';
      query = {
        name: "studentaaa"
      };
      queryUpdate = {
        id: 27
      };
      queryDelete = {
        id: 47
      };
    });

    test('Should Return 200: Get All Students', async () => {
      await Request(server)
        .get(apiUrl)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(3);
          const studentName = _.find(res.body, (item) => item.name.toLowerCase() === 'studentaaa');
          expect(!_.isEmpty(studentName)).toBeTruthy();
        });
    });

    test('Should Return 200: Get Specific Students with Result', async () => {
      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
          expect(res.body.length).toBe(1);
          const student4 = _.find(res.body, (item) => item.name.toLowerCase() === 'student4');
          const studenta = _.find(res.body, (item) => item.name.toLowerCase() === 'studentaaa');
          expect(!_.isEmpty(studenta)).toBeTruthy();
          expect(_.isEmpty(student4)).toBeTruthy();
        });
    });

    test('Should Return 200: Get Specific Students without Result', async () => {
      query.name = 'aaaa';
      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(200)
        .then((res) => {
          expect(_.isEmpty(res.body)).toBeTruthy();
          expect(res.body.length).toBe(0);
          const aaaa = _.find(res.body, (item) => item.name.toLowerCase() === 'aaaa');
          expect(_.isEmpty(aaaa)).toBeTruthy();
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

    test('Should Return 200: Data created using post', async () => {
      apiUrl = '/students/add';
      dataNew = {
        name: "studenttest",
        studentClass: "12D",
        grade: 90
      };

      await Request(server)
        .post(`${apiUrl}`)
        .send(dataNew)
        .expect(200)
        .then(res => {
          expect(res?.body?.id).toBeTruthy()
          latestCreatedId = res?.data?.id;
        });
    });

    test('Should Return 200: Data created using put', async () => {
      apiUrl = '/students/addput';
      dataNew = {
        name: "studenttestput",
        studentClass: "12D",
        grade: 90
      };
      await Request(server)
        .put(`${apiUrl}`)
        .send(dataNew)
        .expect(200)
        .then(res => {
          expect(res?.body?.id).toBeTruthy()
          latestCreatedId = res?.data?.id;
        });
    });

    test('Should Return 400: Data not created using invalid key', async () => {
      apiUrl = '/students/add';
      dataNew = {
        name: "studenttesterr",
        studentClass: "12D",
        grade: "90",
        adwa: ""
      };

      await Request(server)
        .post(`${apiUrl}`)
        .send(dataNew)
        .expect(400);
    });

    test('Should Return 400: Data not created using invalid key', async () => {
      apiUrl = '/students/addput';
      dataNew = {
        name: "studenttestputerr",
        studentClass: "12D",
        grade: 90,
        adwa: ""
      };

      await Request(server)
        .put(`${apiUrl}`)
        .send(dataNew)
        .expect(400);
    });

    test('Should Return 200: Data updated in JSON', async () => {
      apiUrl = `/students/update`;
      dataNew = {
        name: "studenttestedit",
        studentClass: "12D",
        grade: 90,
      };

      await Request(server)
        .patch(`${apiUrl}?${QS.stringify(queryUpdate)}`)
        .send(dataNew)
        .expect(200);
    });

    test('Should Return 404: Data id not found for update', async () => {
      apiUrl = `/students/update`;
      queryUpdate = {
        id: 9999
      };
      dataNew = {
        name: "studenttestediterr",
        studentClass: "12D",
        grade: 90,
      };

      await Request(server)
        .patch(`${apiUrl}?${QS.stringify(queryUpdate)}`)
        .send(dataNew)
        .expect(404);
    });

    test('Should Return 400: Data id is not a number for update', async () => {
      apiUrl = `/students/update`;
      queryUpdate = {
        id: "asdwasd"
      };
      dataNew = {
        name: "studenttestediterr",
        studentClass: "12D",
        grade: 90,
      };

      await Request(server)
        .patch(`${apiUrl}?${QS.stringify(queryUpdate)}`)
        .send(dataNew)
        .expect(400);
    });

    test('Should Return 200: Data successfully deleted', async () => {
      apiUrl = `/students/add`;
      dataNew = {
        name: "studenttestediterr",
        studentClass: "12D",
        grade: 90,
      };
      
      await Request(server)
      .post(`${apiUrl}`)
      .send(dataNew)
      .expect(200)
      .then(async res => {
          expect(res?.body?.id).toBeTruthy();
          latestCreatedId = res?.body?.id;
          queryDelete = {
            id: latestCreatedId
          };

          apiUrl = `/students/delete`;
          await Request(server)
            .delete(`${apiUrl}?${QS.stringify(queryDelete)}`)
            .expect(200);

        });
    });

    test('Should Return 404: Data id not found for delete', async () => {
      apiUrl = `/students/delete`;
      queryDelete = {
        id: 9999
      };

      await Request(server)
        .delete(`${apiUrl}?${QS.stringify(queryDelete)}`)
        .expect(404);
    });

    test('Should Return 400: Data id is not a number for delete', async () => {
      apiUrl = `/students/delete`;
      queryDelete = {
        id: "adwadwad"
      };

      await Request(server)
        .delete(`${apiUrl}?${QS.stringify(queryDelete)}`)
        .expect(400);
    });
  });
});