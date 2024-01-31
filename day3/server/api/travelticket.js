const Router = require('express').Router();

const Validation = require('../helpers/validationHelper');
const TraverticketHelper = require('../helpers/travelticketHelper');
const GeneralHelper = require('../helpers/generalHelper');

const fileName = 'server/api/travelticket.js';

const allBookings = async (request, reply) => {
    try {
        const response = await TraverticketHelper.getAllBooking();

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'All Bookings API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const getBookingDetail = async (request, reply) => {
    try {
        Validation.bookingDetailValidation(request.query);

        const { bookingId } = request.query;
        const response = await TraverticketHelper.getBookingDetailWithId({bookingId});

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Booking Detail API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const allCoupons = async (request, reply) => {
    try {
        const response = await TraverticketHelper.getAllCoupons();

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'All Coupons API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const allCustomers = async (request, reply) => {
    try {
        const response = await TraverticketHelper.getAllCustomers();

        const formatedDateDatas = response.map(e => ({...e, customer_dob: new Date(e.customer_dob).toISOString().slice(0, 10)}));

        return reply.send({
            message: 'success',
            data: formatedDateDatas
        });
    } catch (err) {
        console.log([fileName, 'All Customers API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const createCustomer = async (request, reply) => {
    try {
        Validation.customerFormValidation(request.body);

        const formData = request.body;
        const response = await TraverticketHelper.addCustomer(formData);

        return reply.send({
            message: response,
        });
    } catch (err) {
        console.log([fileName, 'Create Customer API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const createBooking = async (request, reply) => {
    try {
        Validation.bookingDataFormValidation(request.body);

        const formData = request.body;
        const response = await TraverticketHelper.addBooking(formData);

        return reply.send({
            message: response,
        });
    } catch (err) {
        console.log([fileName, 'Create Booking API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const createCoupon = async (request, reply) => {
    try {
        Validation.couponDataFormValidation(request.body);

        const formData = request.body;
        const response = await TraverticketHelper.addCoupon(formData);

        return reply.send({
            message: response,
        });
    } catch (err) {
        console.log([fileName, 'Create Coupon API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const appendCoupon = async (request, reply) => {
    try {
        Validation.appendCouponValidation(request.body);

        const formData = request.body;
        const response = await TraverticketHelper.appendCoupon(formData);

        return reply.send({
            message: response,
        });
    } catch (err) {
        console.log([fileName, 'Append Coupon API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const editCustomer = async (request, reply) => {
    try {
        Validation.editCustomerFormValidation(request.body);

        const formData = request.body;
        const response = await TraverticketHelper.editCustomerData(formData);

        return reply.send({
            message: response,
        });
    } catch (err) {
        console.log([fileName, 'Edit Customer Data API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const deleteCustomer = async (request, reply) => {
    try {
        Validation.deleteWithIdValidation(request.body);

        const formData = request.body;
        const response = await TraverticketHelper.deleteCustomer(formData);

        return reply.send({
            message: response,
        });
    } catch (err) {
        console.log([fileName, 'Delete Customer Data API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const deleteBooking = async (request, reply) => {
    try {
        Validation.deleteWithIdValidation(request.body);

        const formData = request.body;
        const response = await TraverticketHelper.deleteBooking(formData);

        return reply.send({
            message: response,
        });
    } catch (err) {
        console.log([fileName, 'Delete Booking Data API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const deleteCoupon = async (request, reply) => {
    try {
        Validation.deleteWithIdValidation(request.body);

        const formData = request.body;
        const response = await TraverticketHelper.deleteCoupons(formData);

        return reply.send({
            message: response,
        });
    } catch (err) {
        console.log([fileName, 'Delete Coupon Data API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const unapplyCoupon = async (request, reply) => {
    try {
        Validation.deleteWithIdValidation(request.body);

        const formData = request.body;
        const response = await TraverticketHelper.unapplyCoupon(formData);

        return reply.send({
            message: response,
        });
    } catch (err) {
        console.log([fileName, 'Delete Coupon Data API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

Router.get('/bookings/all', allBookings);
Router.get('/bookings/detail', getBookingDetail);
Router.get('/coupons', allCoupons);
Router.get('/customers', allCustomers);

Router.post('/create/customer', createCustomer);
Router.post('/create/booking', createBooking);
Router.post('/create/coupon', createCoupon);
Router.post('/apply-coupon', appendCoupon);

Router.patch('/edit/customer', editCustomer);

Router.delete('/delete/customer', deleteCustomer);
Router.delete('/delete/booking', deleteBooking);
Router.delete('/delete/coupon', deleteCoupon);
Router.delete('/unapply-coupon', unapplyCoupon);

module.exports = Router;