const _ = require('lodash');
const fs = require('fs/promises');
const Boom = require('boom');
const { getPokemons, getPokemonDetail } = require('../services/PokemonAPI');

const prevouslyTryCatchPokemons = [];
let pityChance = 0;

const getJSONParsedData = async () => {
    const studentJSON = await fs.readFile("./assets/db.json", "utf-8");
    return JSON.parse(studentJSON);
}
const writeDataToJSON = async (jsonData) => {
    await fs.writeFile("./assets/db.json", JSON.stringify(jsonData));
};

const getPokemonDataListAPI = async () => {
    const data = await getPokemons();

    const mappedData = data?.results?.map(e => ({
        name: e?.name,
        id: e?.url?.split('/')[6]
    }));

    return Promise.resolve(mappedData);
}
const getPokemonDetailDataAPI = async (id) => {
    const data = await getPokemonDetail(id);
    const mappedData = { ...data, location_area_encounters: undefined, is_default: undefined, game_indices: undefined, sprites: undefined, moves: undefined }
    return Promise.resolve(mappedData);
}
const getMyPokemons = async () => {
    const data = await getJSONParsedData();

    return Promise.resolve(data?.pokemons);
}
const catchPokemon = async (id) => {
    let chanceCaughtPercentage = 0.1;
    chanceCaughtPercentage += pityChance;
    const isCaught = Math.random() > ((100 - chanceCaughtPercentage) / 100);
    let data = null;

    const checkPrevious = prevouslyTryCatchPokemons.find(v => v?.id === parseInt(id));

    if(checkPrevious) {
        data = checkPrevious;
    } else {
        try {
            data = await getPokemonDetail(id);
        } catch (error) {
            if(error?.response?.status === 404) {
                throw Boom.notFound("Pokemon not found!");
            } else {
                throw error;
            }
        }
    }

    if(!data) throw Boom.internal("Error internal data!");

    const mappedData = { ...data, location_area_encounters: undefined, is_default: undefined, game_indices: undefined, sprites: undefined, moves: undefined };

    if(!checkPrevious) {
        prevouslyTryCatchPokemons.push(mappedData);
    }

    if (isCaught) {
        let localData = await getJSONParsedData();
        localData.latestId += 1;

        localData.pokemons.push({
            id: localData.latestId,
            pokemonId: mappedData?.id,
            name: mappedData?.name,
            heigth: mappedData?.heigth,
            weight: mappedData?.weight
        });

        await writeDataToJSON(localData);

        pityChance = 0;
        return Promise.resolve({isSuccess: true, chance: `${chanceCaughtPercentage}%`, message: `Successfully catch pokemon ${mappedData?.name}!`});
    } else {
        const test = pityChance + 0.2;
        if((chanceCaughtPercentage + test) > 100) {
            test = 100 - (chanceCaughtPercentage + pityChance);
        }
        pityChance = test;
        return Promise.resolve({isSuccess: false, chance: `${chanceCaughtPercentage}%`, message: `${mappedData?.name} is escaped. Try again later!`});
    }
}

module.exports = {
    getPokemonDataListAPI,
    getPokemonDetailDataAPI,
    getMyPokemons,
    catchPokemon
}
