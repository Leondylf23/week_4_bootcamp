const _ = require('lodash');
const fs = require('fs/promises');
const Boom = require('boom');
const { getPokemons, getPokemonDetail } = require('../services/PokemonAPI');

const prevouslyTryCatchPokemons = [];

const getJSONParsedData = async () => {
    const studentJSON = await fs.readFile("./assets/db.json", "utf-8");
    return JSON.parse(studentJSON);
}
const writeDataToJSON = async (jsonData) => {
    await fs.writeFile("./assets/db.json", JSON.stringify(jsonData));
};
const getFibbonacciName = (name, myPokemons) => {
    const lastFibbonacci = [];
    const sequence = [];
    let fibonacci = null;

    const countLastFibbonacci = myPokemons.filter(v => {
        const data = v.nickname.split("-");
        if(data[1] && data[0] === name) lastFibbonacci.push(data[1]);
        return data[0] === name;
    }).length;

    for (let i = 0; i < countLastFibbonacci; i++) {
        if (i <= 1) {
            sequence.push(i);
        } else {
            sequence.push(sequence[i - 1] + sequence[i - 2]);
        }
    }
    lastFibbonacci.sort((a, b) => a - b);
    for (let index = 0; index < sequence.length; index++) {
        const e = sequence[index];
        const check = lastFibbonacci[index];

        if(e != check) {
            fibonacci = e;
            break;
        }
    }

    if(sequence.length > 0 && fibonacci != null) {
        return `${name}-${fibonacci}`;
    } else {
        return name;
    }
}
const checkIsPrime = num => {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if(num % i === 0) return false;
    }
    return num > 1;
}

const getPokemonDataListAPI = async (offset, limit) => {
    const data = await getPokemons(offset ? offset : 0, limit ? limit : 20);

    const mappedData = data?.results?.map(e => ({
        name: e?.name,
        id: e?.url?.split('/')[6]
    }));

    return Promise.resolve(mappedData);
}
const getPokemonDetailDataAPI = async (id) => {
    try {
        let data = await getPokemonDetail(id);
        const mappedData = { ...data, location_area_encounters: undefined, is_default: undefined, game_indices: undefined, sprites: undefined, moves: undefined }

        return Promise.resolve(mappedData);
    } catch (error) {
        if(error?.response?.status === 404) throw Boom.notFound("Pokemon not found from API!");

        throw error;
    }
}
const getMyPokemons = async () => {
    const data = await getJSONParsedData();

    return Promise.resolve(data?.pokemons);
}
const catchPokemon = async (id) => {
    let chanceCaughtPercentage = 50;

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
        const nickname = getFibbonacciName(mappedData?.name, localData.pokemons)
        localData.pokemons.push({
            id: localData.latestId,
            pokemonId: mappedData?.id,
            name: mappedData?.name,
            nickname: nickname,
            height: mappedData?.height,
            weight: mappedData?.weight,
        });

        await writeDataToJSON(localData);

        return Promise.resolve({isSuccess: true, chance: `${chanceCaughtPercentage}%`, message: `Successfully catch pokemon ${mappedData?.name}!`, nickname: nickname, insertedId: localData.latestId});
    } else {
        return Promise.resolve({isSuccess: false, chance: `${chanceCaughtPercentage}%`, message: `${mappedData?.name} is escaped. Try again later!`});
    }
}
const renamePokemon = async (id, name) => {
    let localData = await getJSONParsedData();
    let indexData = localData.pokemons.findIndex(v => v.id === id);
    
    if (indexData === -1) throw Boom.notFound("Couldn't find pokemon!");

    const filteredData = localData.pokemons.filter(v => v.id != id);
    const renamed = getFibbonacciName(name, filteredData);
    localData.pokemons[indexData].nickname = renamed;

    await writeDataToJSON(localData);

    return Promise.resolve({ name: renamed, message: `Successfully renamed to ${renamed}`});
}
const releasePokemon = async (id) => {
    const randNumber = Math.floor(Math.random() * 10);
    const isPrimeNum = checkIsPrime(randNumber);
    let pokemonName = "";

    let localData = await getJSONParsedData();
    const data = localData.pokemons.find(v => v.id === id);
    if (!data) throw Boom.notFound("Couldn't find pokemon!");

    pokemonName = data?.nickname;

    if(isPrimeNum) {
        localData.pokemons = localData.pokemons.filter(v => v.id != id);

        await writeDataToJSON(localData);
    }

    return Promise.resolve({number: randNumber, isPrime: isPrimeNum, message: `You get number ${randNumber} which is ${isPrimeNum ? "prime" : "not prime"}. Your pokemon ${pokemonName} is ${isPrimeNum ? "" : "not"} released!`});
}

module.exports = {
    getPokemonDataListAPI,
    getPokemonDetailDataAPI,
    getMyPokemons,
    catchPokemon,
    renamePokemon,
    releasePokemon
}
