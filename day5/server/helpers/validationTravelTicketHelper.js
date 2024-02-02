const Joi = require('joi');
const Boom = require('boom');

const allBookingValidation = (data) => {
  const schema = Joi.object({
    bookingType: Joi.string().valid('VIP','ECO').optional().description('Type of booking, allowed only VIP and ECO.'),
    customerName: Joi.string().optional().description("Search customer name")
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const bookingDetailValidation = (data) => {
  const schema = Joi.object({
    bookingId: Joi.number().integer().required().description('Booking id')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const allCouponsValidation = (data) => {
  const schema = Joi.object({
    couponName: Joi.string().optional().description("Search coupon name")
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const allCustomersValidation = (data) => {
  const schema = Joi.object({
    customerName: Joi.string().optional().description("Search customer name")
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const customerFormValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required().description('Name of customer'),
    dob: Joi.date().required().description('date of birth customer'),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const bookingDataFormValidation = (data) => {
  const schema = Joi.object({
    customerId: Joi.number().integer().required().description('Id of customer'),
    type: Joi.string().valid('VIP','ECO').required().description('Type of booking, allowed only VIP and ECO.'),
    price: Joi.number().min(5000).max(2000000).precision(2).required().description('Price of booking, should be minimum of 5000 and maximum of 2000000')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const couponDataFormValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required().description('Name of coupon'),
    priceCut: Joi.number().min(5000).max(200000).precision(2).required().description('Price cut of coupon, should be minimum of 5000 and maximum of 200000')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const appendCouponValidation = (data) => {
  const schema = Joi.object({
    couponId: Joi.number().integer().required().description('Id of coupon'),
    bookingId: Joi.number().integer().required().description('Id of booking')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const editCustomerFormValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().description('Id of customer'),
    name: Joi.string().max(255).required().description('Name of customer'),
    dob: Joi.date().required().description('date of birth customer'),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const editCouponFormValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().description('Id of coupon'),
    name: Joi.string().max(255).required().description('Name of coupon'),
    priceCut: Joi.number().min(5000).max(200000).precision(2).required().description('Price cut of coupon, should be minimum of 5000 and maximum of 200000')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const deleteWithIdValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().description('Id must be number'),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  allBookingValidation,
  bookingDetailValidation,
  allCouponsValidation,
  allCustomersValidation,

  customerFormValidation,
  bookingDataFormValidation,
  couponDataFormValidation,
  appendCouponValidation,

  editCustomerFormValidation,
  editCouponFormValidation,

  deleteWithIdValidation
};
