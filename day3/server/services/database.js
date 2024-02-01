const _ = require('lodash');
// const MySQL = require('promise-mysql2');  // client does not support.
const MySQL = require('mysql2/promise');
const dotenv = require('dotenv');
const Boom = require('boom');
const fileName = 'server/services/database.js';

// TABLES
const CUSTOMER_TABLE = 'customer';
const BOOKING_TABLE = 'booking';
const COUPON_TABLE = 'coupon';
const COUPON_CONNECTOR_TABLE = 'coupon_connector';

dotenv.config();

const ConnectionPool = MySQL.createPool({
    host: process.env.MYSQL_CONFIG_HOST || 'localhost',
    user: process.env.MYSQL_CONFIG_USER || 'root',
    password: process.env.MYSQL_CONFIG_PASSWORD || '',
    database: process.env.MYSQL_CONFIG_DATABASE || 'travel_ticket',
    port: process.env.MYSQL_CONFIG_PORT || '3306',
});

/*
 * PRIVATE FUNCTION
 */
const __constructQueryResult = (query) => {
    const result = [];
    if (!_.isEmpty(query[0])) {
        query[0].forEach((item) => {
            const key = Object.keys(item);

            // Reconstruct query result
            const object = {};
            key.forEach((data) => {
                object[data] = item[data];
            });

            result.push(object);
        });
    }

    return result;
};

/*
 * PUBLIC FUNCTION
 */

const getAllBookingData = async () => {
    try {
        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();
        const query = await poolConnection.query(
            `
    SELECT
        ${CUSTOMER_TABLE}.customer_name,
	    ${CUSTOMER_TABLE}.customer_dob,
	    ${BOOKING_TABLE}.booking_type,
	    ${BOOKING_TABLE}.booking_price,
	    ${BOOKING_TABLE}.created_date,
	    (
    		SELECT
			    JSON_ARRAYAGG( 
    				JSON_OBJECT( 
					    'price_cut', ${COUPON_TABLE}.coupon_prc_cut, 
					    'coupon', ${COUPON_TABLE}.coupon_name, 
					    'apply_date', ${COUPON_CONNECTOR_TABLE}.created_date 
				    )
			    ) AS coupon_data
		    FROM
                ${COUPON_TABLE}
		    INNER JOIN ${COUPON_CONNECTOR_TABLE} ON ${COUPON_TABLE}.coupon_id = ${COUPON_CONNECTOR_TABLE}.coupon_id 
			    AND ${COUPON_CONNECTOR_TABLE}.is_active = 1
            WHERE 
                ${COUPON_CONNECTOR_TABLE}.booking_id = ${BOOKING_TABLE}.booking_id
                AND ${COUPON_TABLE}.is_active = 1
                AND ${COUPON_CONNECTOR_TABLE}.is_active = 1
	    ) AS coupons 
    FROM
        ${CUSTOMER_TABLE}
	INNER JOIN ${BOOKING_TABLE} ON ${BOOKING_TABLE}.customer_id = ${CUSTOMER_TABLE}.customer_id 
    WHERE
        ${CUSTOMER_TABLE}.is_active = 1
        AND ${BOOKING_TABLE}.is_active = 1
    ;
      `
        );
        await poolConnection.connection.release();
        const result = __constructQueryResult(query);

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Get All Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(result);
    } catch (err) {
        console.log([fileName, 'Get All Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve([]);
    }
};

const getBookingDetail = async (dataObject) => {
    const { bookingId } = dataObject;

    try {
        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();
        const query = await poolConnection.query(
            `
      SELECT
          ${CUSTOMER_TABLE}.customer_name,
          ${CUSTOMER_TABLE}.customer_dob,
          ${BOOKING_TABLE}.booking_type,
          ${BOOKING_TABLE}.booking_price,
          ${BOOKING_TABLE}.created_date,
          (
              SELECT
                  JSON_ARRAYAGG( 
                      JSON_OBJECT( 
                            'conncetor_id', ${COUPON_CONNECTOR_TABLE}.coupon_connector_id,
                            'price_cut', ${COUPON_TABLE}.coupon_prc_cut, 
                            'coupon', ${COUPON_TABLE}.coupon_name, 
                            'apply_date', ${COUPON_CONNECTOR_TABLE}.created_date 
                      )
                  ) AS coupon_data
              FROM
                  ${COUPON_TABLE}
              INNER JOIN ${COUPON_CONNECTOR_TABLE} ON ${COUPON_TABLE}.coupon_id = ${COUPON_CONNECTOR_TABLE}.coupon_id 
                  AND ${COUPON_CONNECTOR_TABLE}.is_active = 1
              WHERE 
                ${COUPON_CONNECTOR_TABLE}.booking_id = ${BOOKING_TABLE}.booking_id
                AND ${COUPON_TABLE}.is_active = 1
                AND ${COUPON_CONNECTOR_TABLE}.is_active = 1
          ) AS coupons 
      FROM
          ${CUSTOMER_TABLE}
      INNER JOIN ${BOOKING_TABLE} ON ${BOOKING_TABLE}.customer_id = ${CUSTOMER_TABLE}.customer_id 
      WHERE
          ${CUSTOMER_TABLE}.is_active = 1
          AND ${BOOKING_TABLE}.booking_id = ${bookingId}
      LIMIT 1
        ;
        `
        );
        await poolConnection.connection.release();
        const result = __constructQueryResult(query);

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Get Detail Data By Booking Id', 'INFO'], {
            message: { timeTaken }
        });

        if (_.isEmpty(result)) throw Boom.notFound('Detail booking is not found!');

        return Promise.resolve(result[0]);
    } catch (err) {
        console.log([fileName, 'Get Detail Data By Booking Id', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve([]);
    }
};

const getAllCouponList = async () => {
    try {
        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();
        const query = await poolConnection.query(
            `
        SELECT
            coupon_id,
            coupon_name,
            coupon_prc_cut,
            created_date
        FROM
            ${COUPON_TABLE}
        WHERE
            is_active = 1
          ;
          `
        );
        await poolConnection.connection.release();
        const result = __constructQueryResult(query);

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Get All Coupons Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(result);
    } catch (err) {
        console.log([fileName, 'Get All Coupons Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve([]);
    }
};

const getAllCustomersList = async () => {
    try {
        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();
        const query = await poolConnection.query(
            `
        SELECT
            customer_id,
            customer_name,
            customer_dob
        FROM
            ${CUSTOMER_TABLE}
        WHERE
            is_active = 1
          ;
          `
        );
        await poolConnection.connection.release();
        const result = __constructQueryResult(query);

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Get All Customer Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(result);
    } catch (err) {
        console.log([fileName, 'Get All Customer Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve([]);
    }
};

const addCustomerData = async (dataObject) => {
    const { name, dob } = dataObject;

    try {
        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();

        await poolConnection.beginTransaction();

        await poolConnection.query(
            `INSERT INTO ${CUSTOMER_TABLE} (customer_name, customer_dob) VALUES ('${name}', '${dob}');`
        );

        await poolConnection.commit();

        await poolConnection.connection.release();

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Add Customer Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(true);
    } catch (err) {
        console.log([fileName, 'Add Customer Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve(false);
    }
};

const addBookingData = async (dataObject) => {
    const { customerId, type, price } = dataObject;

    try {
        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();

        await poolConnection.beginTransaction();

        await poolConnection.query(
            `INSERT INTO ${BOOKING_TABLE} (customer_id, booking_type, booking_price) VALUES ('${customerId}', '${type}', '${price}');`
        );

        await poolConnection.commit();

        await poolConnection.connection.release();

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Add Customer Booking Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(true);
    } catch (err) {
        console.log([fileName, 'Add Customer Booking Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve(false);
    }
};

const addNewCouponData = async (dataObject) => {
    const { name, priceCut } = dataObject;

    try {
        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();

        await poolConnection.query(
            `INSERT INTO ${COUPON_TABLE} (coupon_name, coupon_prc_cut) VALUES ('${name}', '${priceCut}');`
        );

        await poolConnection.connection.release();

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Add Coupon Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(true);
    } catch (err) {
        console.log([fileName, 'Add Coupon Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve(false);
    }
};

const appendCouponToBooking = async (dataObject) => {
    const { couponId, bookingId } = dataObject;

    try {
        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();

        await poolConnection.query(
            `INSERT INTO ${COUPON_CONNECTOR_TABLE} (coupon_id, booking_id) VALUES ('${couponId}', '${bookingId}');`
        );

        await poolConnection.connection.release();

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Add Coupon Connector Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(true);
    } catch (err) {
        console.log([fileName, 'Add Coupon Connector Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve(false);
    }
};

const updateCustomerData = async (dataObject) => {
    const { id, name, dob } = dataObject;

    try {
        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();

        await poolConnection.query(
            `UPDATE ${CUSTOMER_TABLE} SET customer_name = '${name}', customer_dob = '${dob}' WHERE customer_id = ${id};`
        );

        await poolConnection.connection.release();

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Update Customer Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(true);
    } catch (err) {
        console.log([fileName, 'Update Customer Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve(false);
    }
};

const updateCustomerDataIsDeleted = async (dataObject) => {
    const { id } = dataObject;

    try {
        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();

        await poolConnection.query(
            `UPDATE ${CUSTOMER_TABLE} SET is_active = 0 WHERE customer_id = ${id};`
        );

        await poolConnection.connection.release();

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Update Customer To Delete Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(true);
    } catch (err) {
        console.log([fileName, 'Update Customer To Delete Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve(false);
    }
};

const updateBookingDataIsDeleted = async (dataObject) => {
    const { id } = dataObject;

    try {
        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();

        await poolConnection.query(
            `UPDATE ${BOOKING_TABLE} SET is_active = 0 WHERE booking_id = ${id};`
        );

        await poolConnection.connection.release();

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Update Booking To Delete Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(true);
    } catch (err) {
        console.log([fileName, 'Update Booking To Delete Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve(false);
    }
};

const updateCouponsDataIsDeleted = async (dataObject) => {
    const { id } = dataObject;

    try {
        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();

        await poolConnection.query(
            `UPDATE ${COUPON_TABLE} SET is_active = 0 WHERE coupon_id = ${id};`
        );

        await poolConnection.connection.release();

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Update Coupon To Delete Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(true);
    } catch (err) {
        console.log([fileName, 'Update Coupon To Delete Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve(false);
    }
};

const updateUnapplyCouponData = async (dataObject) => {
    const { id } = dataObject;

    try {
        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();

        await poolConnection.query(
            `UPDATE ${COUPON_CONNECTOR_TABLE} SET is_active = 0 WHERE coupon_connector_id = ${id};`
        );

        await poolConnection.connection.release();

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Update Unapply Coupon Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(true);
    } catch (err) {
        console.log([fileName, 'Update Unapply Coupon Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve(false);
    }
};

const checkCustomer = async (dataObject) => {
    try {
        const { id } = dataObject;

        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();
        const query = await poolConnection.query(
            `
        SELECT
            customer_id
        FROM
            ${CUSTOMER_TABLE}
        WHERE
            customer_id = ${id}
            AND is_active = 1
        LIMIT 1
          ;
          `
        );
        await poolConnection.connection.release();
        const result = __constructQueryResult(query);

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Check Customer Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(result);
    } catch (err) {
        console.log([fileName, 'Check Customer Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve([]);
    }
};

const checkBooking = async (dataObject) => {
    try {
        const { id } = dataObject;

        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();
        const query = await poolConnection.query(
            `
        SELECT
            booking_id
        FROM
            ${BOOKING_TABLE}
        WHERE
            booking_id = ${id}
            AND is_active = 1
        LIMIT 1
          ;
          `
        );
        await poolConnection.connection.release();
        const result = __constructQueryResult(query);

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Check Booking Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(result);
    } catch (err) {
        console.log([fileName, 'Check Booking Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve([]);
    }
};

const checkCoupon = async (dataObject) => {
    try {
        const { id } = dataObject;

        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();
        const query = await poolConnection.query(
            `
        SELECT
            coupon_id
        FROM
            ${COUPON_TABLE}
        WHERE
            coupon_id = ${id}
            AND is_active = 1
        LIMIT 1
          ;
          `
        );
        await poolConnection.connection.release();
        const result = __constructQueryResult(query);

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Check Coupon Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(result);
    } catch (err) {
        console.log([fileName, 'Check Coupon Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve([]);
    }
};

const checkCouponAndBooking = async (dataObject) => {
    try {
        const { couponId, bookingId } = dataObject;

        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();
        const queryCoupon = await poolConnection.query(
            `
        SELECT
            coupon_id
        FROM
            ${COUPON_TABLE}
        WHERE
            coupon_id = ${couponId}
            AND is_active = 1
        LIMIT 1
          ;
          `
        );
        const resultCoupon = __constructQueryResult(queryCoupon);

        const queryBooking = await poolConnection.query(
            `
        SELECT
            booking_id
        FROM
            ${BOOKING_TABLE}
        WHERE
            booking_id = ${bookingId}
            AND is_active = 1
        LIMIT 1
          ;
          `
        );
        await poolConnection.connection.release();
        const resultBooking = __constructQueryResult(queryBooking);

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Check Coupon and Booking Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve({ coupon: resultCoupon, booking: resultBooking });
    } catch (err) {
        console.log([fileName, 'Check Coupon and Booking Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve([]);
    }
};

const checkCouponConnector = async (dataObject) => {
    try {
        const { id } = dataObject;

        const timeStart = process.hrtime();
        const poolConnection = await ConnectionPool.getConnection();
        const query = await poolConnection.query(
            `
        SELECT
            coupon_connector_id
        FROM
            ${COUPON_CONNECTOR_TABLE}
        WHERE
            coupon_connector_id = ${id}
            AND is_active = 1
        LIMIT 1
          ;
          `
        );
        await poolConnection.connection.release();
        const result = __constructQueryResult(query);

        const timeDiff = process.hrtime(timeStart);
        const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

        console.log([fileName, 'Check Coupons Connector Data', 'INFO'], {
            message: { timeTaken }
        });

        return Promise.resolve(result);
    } catch (err) {
        console.log([fileName, 'Check Coupons Connector Data', 'ERROR'], {
            message: { info: `${err}` }
        });
        return Promise.resolve([]);
    }
};

module.exports = {
    getAllBookingData,
    getBookingDetail,
    getAllCouponList,
    getAllCustomersList,

    addCustomerData,
    addBookingData,
    addNewCouponData,
    appendCouponToBooking,

    updateCustomerData,

    updateCustomerDataIsDeleted,
    updateBookingDataIsDeleted,
    updateCouponsDataIsDeleted,
    updateUnapplyCouponData,

    checkCustomer,
    checkBooking,
    checkCouponConnector,
    checkCouponAndBooking,
    checkCoupon
};