const _ = require('lodash');
const Boom = require('boom');
const { like } = require('sequelize/lib/operators');

const db = require('../../models');
const GeneralHelper = require('./generalHelper');

// PRIVATE FUNCTIONS

// TRAVELTICKET HELPERS FUNCTIONS
const getAllBooking = async (dataObject) => {
    const { bookingType, customerName } = dataObject;

    try {
        const data = await db.booking.findAll({
            include: [
                {
                    association: 'customer',
                    required: true,
                    where: { 
                        is_active: true,
                        ...(customerName && { customer_name: { [like]: `%${customerName}%` } })
                     },
                    attributes: ['customer_name']
                },
                {
                    association: 'coupon_connectors',
                    required: false,
                    where: { is_active: true },
                    attributes: ['id'],
                    include: [
                        {
                            association: 'coupon',
                            required: true,
                            where: { is_active: true },
                            attributes: ['coupon_name', 'coupon_prc_cut']
                        }
                    ]
                },
            ],
            where: { 
                is_active: true,
                ...(bookingType && { booking_type: bookingType })
            },
            attributes: { exclude: ['is_active', 'customer_id'] }
        });

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const getBookingDetailWithId = async (dataObject) => {
    try {
        const data = await db.booking.findOne({
            include: [
                {
                    association: 'customer',
                    required: true,
                    where: { is_active: true },
                    attributes: ['customer_name']
                },
                {
                    association: 'coupon_connectors',
                    required: false,
                    where: { is_active: true },
                    attributes: ['id'],
                    include: [
                        {
                            association: 'coupon',
                            required: true,
                            where: { is_active: true },
                            attributes: ['coupon_name', 'coupon_prc_cut']
                        }
                    ]
                },
            ],
            attributes: { exclude: ['is_active', 'customer_id'] },
            where: { id: dataObject?.bookingId, is_active: true },
        });

        if(_.isEmpty(data)) throw Boom.notFound('Booking detail is not found!');

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const getAllCoupons = async (dataObject) => {
    try {
        const { couponName } = dataObject;

        const data = await db.coupon.findAll({
            where: { 
                is_active: true,
                ...(couponName && { coupon_name: { [like]: `%${couponName}%` } })
            },
            attributes: { exclude: ['is_active'] }
        });

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const getAllCustomers = async (dataObject) => {
    try {
        const { customerName } = dataObject;
        const data = await db.customer.findAll({
            include: [
                {
                    association: 'bookings',
                    required: false,
                    where: { is_active: true },
                    attributes: ['id', 'booking_type', 'booking_price', 'createdAt']
                },
            ],
            where: { 
                is_active: true,
                ...(customerName && { customer_name: { [like]: `%${customerName}%` } })
            },
            attributes: { exclude: ['is_active'] },
        });

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const addCustomer = async (dataObject, adminId) => {
    try {
        const { name, dob } = dataObject;
        const data = await db.customer.create({ customer_name: name, customer_dob: dob, createdBy: adminId });

        return Promise.resolve({ 
            createdId: data?.id,
            createdData: data
         });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const addBooking = async (dataObject, adminId) => {
    try {
        const { customerId, type, price } = dataObject;

        const checkCustomerId = await db.customer.findOne({
            where: { id: customerId, is_active: true }
        });
        if(_.isEmpty(checkCustomerId)) throw Boom.notFound("Customer not found from this id!")

        const data = await db.booking.create({ customer_id: customerId, booking_type: type, booking_price: price, createdBy: adminId });

        return Promise.resolve({ 
            createdId: data?.id,
            createdData: data
         });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const addCoupon = async (dataObject, adminId) => {
    try {
        const { name, priceCut } = dataObject;

        const data = await db.coupon.create({ coupon_name: name, coupon_prc_cut: priceCut, createdBy: adminId });

        return Promise.resolve({ 
            createdId: data?.id,
            createdData: data
         });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const appendCoupon = async (dataObject, adminId) => {
    try {
        const { couponId, bookingId } = dataObject;

        const checkCouponId = await db.coupon.findOne({
            where: { id: couponId, is_active: true }
        });
        if(_.isEmpty(checkCouponId)) throw Boom.notFound("Coupon not found from this couponId!");

        const checkBookingId = await db.booking.findOne({
            where: { id: bookingId, is_active: true },
            include: {
                association: 'coupon_connectors',
                required: false,
                where: { is_active: true },
                attributes: ['id'],
                include: [
                    {
                        association: 'coupon',
                        required: true,
                        where: { is_active: true },
                        attributes: ['coupon_prc_cut']
                    }
                ]
            },
        });
        if(_.isEmpty(checkBookingId)) throw Boom.notFound("Booking not found from this bookingId!");

        const appliedCouponsPrices = checkBookingId?.coupon_connectors?.map(coupon => parseFloat(coupon.coupon?.dataValues?.coupon_prc_cut));
        const priceBooking = parseFloat(checkBookingId?.dataValues?.booking_price);
        const priceCut = parseFloat(checkCouponId?.dataValues?.coupon_prc_cut);
        let totalAppliedCouponsPrices = 0;

        appliedCouponsPrices.forEach(price => {
            totalAppliedCouponsPrices += price;
        });

        if(priceBooking < (priceCut + totalAppliedCouponsPrices)) throw Boom.badData("This booking is already reached maximum price cut!");

        const data = await db.coupon_connector.create({ coupon_id: couponId, booking_id: bookingId, createdBy: adminId });

        return Promise.resolve({ 
            createdId: data?.id,
            createdData: data
         });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const editCustomerData = async (dataObject, adminId) => {
    try {
        const { id, name, dob } = dataObject;

        const data = await db.customer.findOne({
            where: { id, is_active: true }
        });
        if(_.isEmpty(data)) throw Boom.notFound('Customer not found!');

        const adminIdCheck = data?.dataValues?.createdBy;
        if(adminIdCheck !== adminId) throw Boom.unauthorized('Your admin account does not allowed to modify other admin data!');

        await data.update({ customer_name: name, customer_dob: dob });

        return Promise.resolve({ 
            updatedId: data?.id,
            updatedData: data
         });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const editCouponData = async (dataObject, adminId) => {
    try {
        const { id, name, priceCut } = dataObject;

        const data = await db.coupon.findOne({
            where: { id, is_active: true }
        });
        if(_.isEmpty(data)) throw Boom.notFound('Coupon not found!');

        const adminIdCheck = data?.dataValues?.createdBy;
        if(adminIdCheck !== adminId) throw Boom.unauthorized('Your admin account does not allowed to modify other admin data!');

        await data.update({ coupon_name: name, coupon_prc_cut: priceCut });

        return Promise.resolve({ 
            updatedId: data?.id,
            updatedData: data
         });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const deleteCustomer = async (dataObject, adminId) => {
    try {
        const { id } = dataObject;

        const data = await db.customer.findOne({
            where: { id, is_active: true }
        });
        if(_.isEmpty(data)) throw Boom.notFound('Customer not found!');

        const adminIdCheck = data?.dataValues?.createdBy;
        if(adminIdCheck !== adminId) throw Boom.unauthorized('Your admin account does not allowed to modify other admin data!');

        await data.update({ is_active: false });

        return Promise.resolve({ 
            deletedId: data?.id,
         });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const deleteBooking = async (dataObject, adminId) => {
    try {
        const { id } = dataObject;

        const data = await db.booking.findOne({
            where: { id, is_active: true }
        });
        if(_.isEmpty(data)) throw Boom.notFound('Booking not found!');

        const adminIdCheck = data?.dataValues?.createdBy;
        if(adminIdCheck !== adminId) throw Boom.unauthorized('Your admin account does not allowed to modify other admin data!');

        await data.update({ is_active: false });

        return Promise.resolve({ 
            deletedId: data?.id,
         });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const deleteCoupons = async (dataObject, adminId) => {
    try {
        const { id } = dataObject;

        const data = await db.coupon.findOne({
            where: { id, is_active: true }
        });
        if(_.isEmpty(data)) throw Boom.notFound('Coupon not found!');

        const adminIdCheck = data?.dataValues?.createdBy;
        if(adminIdCheck !== adminId) throw Boom.unauthorized('Your admin account does not allowed to modify other admin data!');

        await data.update({ is_active: false });

        return Promise.resolve({ 
            deletedId: data?.id,
         });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const unapplyCoupon = async (dataObject, adminId) => {
    try {
        const { id } = dataObject;

        const data = await db.coupon_connector.findOne({
            where: { id, is_active: true }
        });
        if(_.isEmpty(data)) throw Boom.notFound('Connector not found!');

        const adminIdCheck = data?.dataValues?.createdBy;
        if(adminIdCheck !== adminId) throw Boom.unauthorized('Your admin account does not allowed to modify other admin data!');

        await data.update({ is_active: false });

        return Promise.resolve({ 
            deletedId: data?.id,
         });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
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
    editCouponData,

    deleteCustomer,
    deleteBooking,
    deleteCoupons,
    unapplyCoupon
}
