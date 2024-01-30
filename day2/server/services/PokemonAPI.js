const axios = require('axios');
const { commonHttpRequest } = require('../helpers/generalHelper');

const hostUrl = "https://pokeapi.co/api/v2";
const endpoints = {
    listPokemon: "/pokemon",
}

const apiOptions = (endpoint, method, header = {}, params = {}, data = {}) => {
    const defaultHeader = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    };

    const headers = { ...defaultHeader, ...header };
    const options = {
        url: hostUrl + endpoint,
        method,
        headers,
        data,
        params,
    };

    return options;
};


const getPokemons = async (offset, limit) => {
    const resData = await commonHttpRequest(apiOptions(`${endpoints.listPokemon}`, "GET", {}, {limit, offset}));

    return resData;
}
const getPokemonDetail = async (id) => {
    const resData = await commonHttpRequest(apiOptions(`${endpoints.listPokemon}/${id}`, "GET"));

    return resData;
}

module.exports = {
    getPokemons,
    getPokemonDetail
}