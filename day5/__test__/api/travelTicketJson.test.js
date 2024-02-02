const Request = require('supertest');
const QS = require('qs');
const _ = require('lodash');

const GeneralHelper = require('../../server/helpers/generalHelper');
const TravelTicketHelper = require('../../server/api/travelticket');

let apiUrl;
let server;
let query;
let body;

let createdCustomerId = 0;
let createdBookingId = 0;
let createdCouponId = 0;

describe('Travel Ticket Json', () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer('/travelticket', TravelTicketHelper);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('Customer', () => {
    beforeEach(() => {
      apiUrl = '/travelticket/customer';
      body = {
        name: "From Test",
        dob: "2001-01-01"
      };
    });

    test('Should Return 200: Create Customer', async () => {
      const res = await Request(server)
        .post(apiUrl + '/create')
        .send(body)
        .expect(200)

        const createdId = res.body?.data?.createdId;
        expect(createdId).toBeTruthy();
        createdCustomerId = createdId;
    });

    test('Should Return 400: Create Customer with Invalid DOB Format', async () => {
      body = {
        name: "From Test",
        dob: "dsasddasa"
      };

      await Request(server)
        .post(apiUrl + '/create')
        .send(body)
        .expect(400)
    });

    test('Should Return 400: Create Customer with Invalid Body Key', async () => {
      body = {
        name: "From Test",
        dwadwad: "20010101"
      };

      await Request(server)
        .post(apiUrl + '/create')
        .send(body)
        .expect(400)
    });

    test('Should Return 400: Create Customer with Missing Body Key', async () => {
      body = {
        dob: "2001-01-01"
      };

      await Request(server)
        .post(apiUrl + '/create')
        .send(body)
        .expect(400)
    });

    test('Should Return 200: Get All Customers', async () => {
      const res = await Request(server)
        .get(apiUrl)
        .expect(200)
      
      const data = res.body?.data;
      
      expect(!_.isEmpty(data)).toBeTruthy();
      const getCreatedData = _.find(data, (item) => item.id === createdCustomerId);
      expect(!_.isEmpty(getCreatedData)).toBeTruthy();
    });

  });
});