const Router = require('express').Router();

const Validation = require('../helpers/validationHelper');
const PokemonHelper = require('../helpers/pokemonHelper');
const GeneralHelper = require('../helpers/generalHelper');

const fileName = 'server/api/pokemon.js';

const getPokemonList = async (request, reply) => {
    try {
        const data = await PokemonHelper.getPokemonDataListAPI();

        return reply.send(data);
    } catch (err) {
        console.log([fileName, 'list', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
}
const getPokemonDetail = async (request, reply) => {
    try {
        Validation.pokemonDetailId(request.query);
        const { id } = request.query;

        const data = await PokemonHelper.getPokemonDetailDataAPI(id);

        return reply.send(data);
    } catch (err) {
        console.log([fileName, 'list', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
}
const getMyPokemonList = async (request, reply) => {
    try {
        const data = await PokemonHelper.getMyPokemons();
        return reply.send(data);
    } catch (err) {
        console.log([fileName, 'list', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
}
const catchPokemon = async (request, reply) => {
    try {
        Validation.pokemonDetailId(request.query);
        const { id } = request.query;

        const data = await PokemonHelper.catchPokemon(id);

        return reply.send(data);
    } catch (err) {
        console.log([fileName, 'list', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
}

Router.get("/list-pokemons", getPokemonList);
Router.get("/detail-pokemon", getPokemonDetail);
Router.get("/my-pokemons", getMyPokemonList);
Router.get("/catch", catchPokemon);

module.exports = Router;
