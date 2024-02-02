const Joi = require('joi');
const Boom = require('boom');

const loginFormValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).required().description('Valid email address'),
        password: Joi.string().min(6).max(20).required().description("Password must be at least 6 characters and not more than 20 characters")
    });

    if (schema.validate(data).error) {
        throw Boom.badRequest(schema.validate(data).error);
    }
};

const registerFormValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).required().description('Valid email address'),
        password: Joi.string().min(6).max(20).required().description("Password must be at least 6 characters and not more than 20 characters"),
        fullname: Joi.string().min(3).max(255).required().description("Full name must be at least 3 characters and not more than 255 characters and alphabetic characters"),
        dob: Joi.date().required().description("Date of birth must be valid date")
    });

    if (schema.validate(data).error) {
        throw Boom.badRequest(schema.validate(data).error);
    }
};

module.exports = {
    loginFormValidation,
    registerFormValidation,
};
