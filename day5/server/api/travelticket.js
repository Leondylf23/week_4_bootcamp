const Router = require('express').Router();

const ValidationTravelTicket = require('../helpers/validationTravelTicketHelper');
const TraverticketHelper = require('../helpers/travelticketHelper');
const GeneralHelper = require('../helpers/generalHelper');
const AuthMiddleware = require('../middlewares/authMiddleware');

const fileName = 'server/api/travelticket.js';

// PRIVATE FUCNTIONS

// ROUTE FUNCTIONS
const allBookings = async (request, reply) => {
    try {
        ValidationTravelTicket.allBookingValidation(request.query);

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
        ValidationTravelTicket.bookingDetailValidation(request.query);

        const { bookingId } = request.query;
        const response = await TraverticketHelper.getBookingDetailWithId({ bookingId });

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
        ValidationTravelTicket.allCouponsValidation(request.query);

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
        ValidationTravelTicket.allCustomersValidation(request.query);

        const formData = request.query;
        const response = await TraverticketHelper.getAllCustomers(formData);

        const formatedDateDatas = response.map(customer => ({ ...customer?.dataValues, customer_dob: new Date(customer?.dataValues?.customer_dob).toISOString().slice(0, 10) }));

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
        ValidationTravelTicket.customerFormValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        const formData = request.body;
        const response = await TraverticketHelper.addCustomer(formData, userData?.userId);

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
        ValidationTravelTicket.bookingDataFormValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        const formData = request.body;
        const response = await TraverticketHelper.addBooking(formData, userData?.userId);

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
        ValidationTravelTicket.couponDataFormValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        const formData = request.body;
        const response = await TraverticketHelper.addCoupon(formData, userData?.userId);

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
        ValidationTravelTicket.appendCouponValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        const formData = request.body;
        const response = await TraverticketHelper.appendCoupon(formData, userData?.userId);

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
        ValidationTravelTicket.editCustomerFormValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        const formData = request.body;
        const response = await TraverticketHelper.editCustomerData(formData, userData?.userId);

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
        ValidationTravelTicket.editCouponFormValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        const formData = request.body;
        const response = await TraverticketHelper.editCouponData(formData, userData?.userId);

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
        ValidationTravelTicket.deleteWithIdValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        const formData = request.body;
        const response = await TraverticketHelper.deleteCustomer(formData, userData?.userId);

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
        ValidationTravelTicket.deleteWithIdValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        const formData = request.body;
        const response = await TraverticketHelper.deleteBooking(formData, userData?.userId);

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
        ValidationTravelTicket.deleteWithIdValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        const formData = request.body;
        const response = await TraverticketHelper.deleteCoupons(formData, userData?.userId);

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
        ValidationTravelTicket.deleteWithIdValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        const formData = request.body;
        const response = await TraverticketHelper.unapplyCoupon(formData, userData?.userId);

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

Router.post('/customer/create', AuthMiddleware.validateToken, createCustomer);
Router.post('/booking/create', AuthMiddleware.validateToken, createBooking);
Router.post('/coupon/create', AuthMiddleware.validateToken, createCoupon);

Router.put('/coupon/apply', AuthMiddleware.validateToken, appendCoupon);

Router.patch('/customer/edit', AuthMiddleware.validateToken, editCustomer);
Router.patch('/coupon/edit', AuthMiddleware.validateToken, editCoupon);

Router.delete('/customer/delete', AuthMiddleware.validateToken, deleteCustomer);
Router.delete('/booking/delete', AuthMiddleware.validateToken, deleteBooking);
Router.delete('/coupon/delete', AuthMiddleware.validateToken, deleteCoupon);
Router.delete('/coupon/unapply', AuthMiddleware.validateToken, unapplyCoupon);

module.exports = Router;
