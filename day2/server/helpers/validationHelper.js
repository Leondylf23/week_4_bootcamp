const Joi = require('joi');
const Boom = require('boom');

const pokemonListData = (data) => {
  const schema = Joi.object({
    offset: Joi.number().optional().integer().description("Offset of page"),
    limit: Joi.number().optional().integer().description("Limit of page"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const pokemonDetailId = (data) => {
  const schema = Joi.object({
    id: Joi.number().required().integer().description("Id of pokemon"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const pokemonRenameValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().required().integer().description("Id of pokemon"),
    name: Joi.string().required().alphanum().description("Name of pokemon"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  pokemonDetailId,
  pokemonRenameValidation,
  pokemonListData
};
