const _ = require('lodash');
const Boom = require('boom');
const db = require('../../models');

const { getAllBookingData, addCustomerData, addBookingData, addNewCouponData, appendCouponToBooking, getBookingDetail, getAllCouponList, getAllCustomersList, updateCustomerData, updateCustomerDataIsDeleted, updateBookingDataIsDeleted, updateCouponsDataIsDeleted, updateUnapplyCouponData, checkCustomer, checkBooking, checkCoupon, checkCouponConnector, checkCouponAndBooking } = require('../services/database');
const GeneralHelper = require('./generalHelper');

// PRIVATE FUNCTIONS

// TRAVELTICKET HELPERS FUNCTIONS
const getAllBooking = async (dataObject) => {
    try {
        const bookingData = db.booking.findAll({
            include: 'customer'
        });

        return Promise.resolve(bookingData);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const getBookingDetailWithId = async (dataObject) => {
    try {
        const bookingData = db.booking.findOne({
            where: { id: dataObject?.bookingId },
            include: 'customer'
        });

        if(_.isEmpty(bookingData)) throw Boom.notFound('Booking detail is not found!');

        return Promise.resolve(bookingData);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const getAllCoupons = async (dataObject) => {
    const bookingData = await getAllCouponList();

    return Promise.resolve(bookingData);
};

const getAllCustomers = async (dataObject) => {
    const bookingData = await getAllCustomersList();

    return Promise.resolve(bookingData);
};

const addCustomer = async (dataObject) => {
    const isExecuted = await addCustomerData(dataObject);
    if(!isExecuted) throw Boom.internal('Something wrong when executing API!');

    return Promise.resolve('Successfully added customer to database.');
};

const addBooking = async (dataObject) => {
    const checkArr = await checkCustomer({id: dataObject?.customerId});
    if(_.isEmpty(checkArr)) throw Boom.notFound('Customer data not found!');

    const isExcecuted = await addBookingData(dataObject);
    if(!isExcecuted) throw Boom.internal('Something wrong when executing API!');

    return Promise.resolve('Successfully added booking to database.');
};

const addCoupon = async (dataObject) => {
    const isExecuted = await addNewCouponData(dataObject);
    if(!isExecuted) throw Boom.internal('Something wrong when executing API!');

    return Promise.resolve('Successfully added new coupon to database.');
};

const appendCoupon = async (dataObject) => {
    const checkArr = await checkCouponAndBooking({ couponId: dataObject?.couponId, bookingId: dataObject?.bookingId });

    if(_.isEmpty(checkArr?.coupon)) throw Boom.notFound('Coupon data not found!');
    if(_.isEmpty(checkArr?.booking)) throw Boom.notFound('Booking data not found!');
    
    const isExecuted = await appendCouponToBooking(dataObject);
    if(!isExecuted) throw Boom.internal('Something wrong when executing API!');

    return Promise.resolve('Successfully add coupon to booking to database.');
};

const editCustomerData = async (dataObject) => {
    const checkArr = await checkCustomer(dataObject);
    if(_.isEmpty(checkArr)) throw Boom.notFound('Customer data not found!');

    const isExecuted = await updateCustomerData(dataObject);
    if(!isExecuted) throw Boom.internal('Something wrong when excecuting API!');

    return Promise.resolve('Successfully update customer data in database.');
};

const deleteCustomer = async (dataObject) => {
    const checkArr = await checkCustomer(dataObject);
    if(_.isEmpty(checkArr)) throw Boom.notFound('Customer data not found!');

    const isExecuted = await updateCustomerDataIsDeleted(dataObject);
    if(!isExecuted) throw Boom.internal('Something wrong when excecuting API!');

    return Promise.resolve('Successfully delete customer data in database.');
};

const deleteBooking = async (dataObject) => {
    const checkArr = await checkBooking(dataObject);
    if(_.isEmpty(checkArr)) throw Boom.notFound('Booking data not found!');

    const isExecuted = await updateBookingDataIsDeleted(dataObject);
    if(!isExecuted) throw Boom.internal('Something wrong when excecuting API!');

    return Promise.resolve('Successfully delete booking data in database.');
};

const deleteCoupons = async (dataObject) => {
    const checkArr = await checkCoupon(dataObject);
    if(_.isEmpty(checkArr)) throw Boom.notFound('Coupon data not found!');

    const isExecuted = await updateCouponsDataIsDeleted(dataObject);
    if(!isExecuted) throw Boom.internal('Something wrong when excecuting API!');

    return Promise.resolve('Successfully delete coupon data in database.');
};

const unapplyCoupon = async (dataObject) => {
    const checkArr = await checkCouponConnector(dataObject);
    if(_.isEmpty(checkArr)) throw Boom.notFound('Coupon Connector data not found!');

    const isExecuted = await updateUnapplyCouponData(dataObject);
    if(!isExecuted) throw Boom.internal('Something wrong when excecuting API!');

    return Promise.resolve('Successfully unapply coupon in database.');
};

module.exports = {
    getAllBooking,
    getAllCoupons,
    getAllCustomers,
    getBookingDetailWithId,

    addCustomer,
    addBooking,
    addCoupon,
    appendCoupon,

    editCustomerData,

    deleteCustomer,
    deleteBooking,
    deleteCoupons,
    unapplyCoupon
}
