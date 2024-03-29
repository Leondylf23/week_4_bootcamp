const Joi = require('joi');
const Boom = require('boom');

const studentListValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().optional().description('Student Name')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const studentFormValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().description("Name of student"),
    studentClass: Joi.string().description("Class of student"),
    grade: Joi.number().integer().description("Grade of student")
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const studentIdValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().description("Id of Student"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  studentListValidation,
  studentFormValidation,
  studentIdValidation
};
