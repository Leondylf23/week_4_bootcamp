const Joi = require('joi');
const Boom = require('boom');

// const studentListValidation = (data) => {
//   const schema = Joi.object({
//     name: Joi.string().optional().description('Student Name')
//   });

//   if (schema.validate(data).error) {
//     throw Boom.badRequest(schema.validate(data).error);
//   }
// };
// const studentFormValidation = (data) => {
//   const schema = Joi.object({
//     name: Joi.string().description("Name of student"),
//     studentClass: Joi.string().description("Class of student"),
//     grade: Joi.number().description("Grade of student")
//   });

//   if (schema.validate(data).error) {
//     throw Boom.badRequest(schema.validate(data).error);
//   }
// }
// const studentUpdateFormValidation = (data) => {
//   const schema = Joi.object({
//     id: Joi.number().description("Id of Student"),
//     name: Joi.string().description("Name of student"),
//     studentClass: Joi.string().description("Class of student"),
//     grade: Joi.number().description("Grade of student")
//   });

//   if (schema.validate(data).error) {
//     throw Boom.badRequest(schema.validate(data).error);
//   }
// }
// const studentDeleteValidation = (data) => {
//   const schema = Joi.object({
//     id: Joi.number().description("Id of Student"),
//   });

//   if (schema.validate(data).error) {
//     throw Boom.badRequest(schema.validate(data).error);
//   }
// }

const pokemonDetailId = (data) => {
  const schema = Joi.object({
    id: Joi.number().required().integer().description("Id of pokeomn"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
}

module.exports = {
  pokemonDetailId
};
