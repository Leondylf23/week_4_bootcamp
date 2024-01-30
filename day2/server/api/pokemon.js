const Router = require('express').Router();

const Validation = require('../helpers/validationHelper');
const PokemonHelper = require('../helpers/pokemonHelper');
const GeneralHelper = require('../helpers/generalHelper');

const fileName = 'server/api/pokemon.js';

const getPokemonList = async (request, reply) => {
    try {
        Validation.pokemonListData(request.query);
        const { offset, limit } = request.query;

        const data = await PokemonHelper.getPokemonDataListAPI(offset, limit);

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
        Validation.pokemonDetailId(request.body);
        const { id } = request.body;

        const data = await PokemonHelper.catchPokemon(id);

        return reply.send(data);
    } catch (err) {
        console.log([fileName, 'list', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
}
const releasePokemon = async (request, reply) => {
    try {
        Validation.pokemonDetailId(request.body);
        const { id } = request.body;
        
        const data = await PokemonHelper.releasePokemon(id);
        return reply.send(data);
    } catch (err) {
        console.log([fileName, 'list', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
}
const renamePokemon = async (request, reply) => {
    try {
        Validation.pokemonRenameValidation(request.body);
        const { id, name } = request.body;
        
        const data = await PokemonHelper.renamePokemon(id, name);
        return reply.send(data);
    } catch (err) {
        console.log([fileName, 'list', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
}

Router.get("/list-pokemons", getPokemonList);
Router.get("/detail-pokemon", getPokemonDetail);
Router.get("/my-pokemons", getMyPokemonList);
Router.post("/catch", catchPokemon);
Router.delete("/release-pokemon", releasePokemon);
Router.patch("/rename-pokemon", renamePokemon);

module.exports = Router;
