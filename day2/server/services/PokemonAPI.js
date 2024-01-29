const axios = require('axios');

const hostUrl = "https://pokeapi.co/api/v2";
const endpoints = {
    listPokemon: "/pokemon",
}

const callAPI = async (endpoint, method, header = {}, params = {}, data = {}) => {
    const defaultHeader = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    };

    const headers = {...defaultHeader, ...header};
    const options = {
        url: hostUrl + endpoint,
        method,
        headers,
        data,
        params,
    };

    return axios(options).then((response) => {
        const responseAPI = response.data;
        return responseAPI;
    });
};

const getPokemons = async () => {
    const resData = await callAPI(`${endpoints.listPokemon}`, "GET");

    return resData;
}
const getPokemonDetail = async (id) => {
    const resData = await callAPI(`${endpoints.listPokemon}/${id}`, "GET");

    return resData;
}

module.exports = {
    getPokemons,
    getPokemonDetail
}