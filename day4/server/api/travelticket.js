const Router = require('express').Router();

const Validation = require('../helpers/validationHelper');
const TraverticketHelper = require('../helpers/travelticketHelper');
const GeneralHelper = require('../helpers/generalHelper');

const fileName = 'server/api/travelticket.js';

const allBookings = async (request, reply) => {
    try {
        Validation.allBookingValidation(request.query);

        const formData = request.query;
        const response = await TraverticketHelper.getAllBooking(formData);

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
        Validation.allCouponsValidation(request.query);

        const formData = request.query;
        const response = await TraverticketHelper.getAllCoupons(formData);

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
        Validation.allCustomersValidation(request.query);

        const formData = request.query;
        const response = await TraverticketHelper.getAllCustomers(formData);

        const formatedDateDatas = response.map(customer => ({...customer?.dataValues, customer_dob: new Date(customer?.dataValues?.customer_dob).toISOString().slice(0, 10)}));

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
            message: "success",
            data: response
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
            message: "success",
            data: response
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
            message: "success",
            data: response
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
            message: "success",
            data: response
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
            message: "success",
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Edit Customer Data API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const editCoupon = async (request, reply) => {
    try {
        Validation.editCouponFormValidation(request.body);

        const formData = request.body;
        const response = await TraverticketHelper.editCouponData(formData);

        return reply.send({
            message: "success",
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Edit Coupon Data API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const deleteCustomer = async (request, reply) => {
    try {
        Validation.deleteWithIdValidation(request.body);

        const formData = request.body;
        const response = await TraverticketHelper.deleteCustomer(formData);

        return reply.send({
            message: "success",
            data: response
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
            message: "success",
            data: response
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
            message: "success",
            data: response
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
            message: "success",
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Unapply Coupon Data API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

Router.get('/booking', allBookings);
Router.get('/booking/detail', getBookingDetail);
Router.get('/coupon', allCoupons);
Router.get('/customer', allCustomers);

Router.post('/customer/create', createCustomer);
Router.post('/booking/create', createBooking);
Router.post('/coupon/create', createCoupon);

Router.put('/coupon/apply', appendCoupon);

Router.patch('/customer/edit', editCustomer);
Router.patch('/coupon/edit', editCoupon);

Router.delete('/customer/delete', deleteCustomer);
Router.delete('/booking/delete', deleteBooking);
Router.delete('/coupon/delete', deleteCoupon);
Router.delete('/coupon/unapply', unapplyCoupon);

module.exports = Router;
