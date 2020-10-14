const axios = require('axios');

let locations = []
let episodes = []
let characters = []

/**
 * Recuperar los resultados de la API
 *
 * @param path
 * @returns {Promise<[]>}
 */
const fetchApiResults = async (path) => {
    let currentPage = 1
    let results = []
    let firstResponse = await axios.get('https://rickandmortyapi.com/api/' + path)
    let totalPages = firstResponse.data.info.pages
    firstResponse.data.results.forEach((result) => results.push(result))
    for (currentPage++;currentPage <= totalPages;currentPage++) {
        let nextResponses = await axios.get('https://rickandmortyapi.com/api/' + path + '?page=' + currentPage)
        nextResponses.data.results.forEach((result) => results.push(result))
    }
    return results
}

/**
 * Recuperar las ubicaciones
 *
 * @returns {Promise<*[]>}
 */
const fetchLocations = async () => {
    locations = await fetchApiResults('location')
    return locations
}

/**
 * Recuperar los episodios
 *
 * @returns {Promise<*[]>}
 */
const fetchEpisodes = async () => {
    episodes = await fetchApiResults('episode')
    return episodes
}

/**
 * Recuperar los personajes
 *
 * @returns {Promise<*[]>}
 */
const fetchCharacters = async () => {
    characters = await fetchApiResults('character')
    return characters
}


/**
 * Contador de letras:
 * - Cuantas veces aparece la letra "l" en los nombres de las ubicaciones
 *
 * @returns {Promise<number>}
 */
const howManyLetterLHaveTheLocations = async () => {
    return (await fetchLocations())
        .map((location) => location.name)
        .join('')
        .toLowerCase()
        .match(/([l])/gi)
        .length
}

/**
 * Contador de letras:
 * - Cuantas veces aparece la letra "e" en los nombres de las episodios
 *
 * @returns {Promise<number>}
 */
const howManyLetterEHaveTheEpisodes = async () => {
    return (await fetchEpisodes())
        .map((location) => location.name)
        .join('')
        .toLowerCase()
        .match(/([e])/gi)
        .length
}

/**
 * Contador de letras:
 * - Cuantas veces aparece la letra "c" en los nombres de los personajes
 *
 * @returns {Promise<number>}
 */
const howManyLetterCHaveTheCharacters = async () => {
    return (await fetchCharacters())
        .map((location) => location.name)
        .join('')
        .toLowerCase()
        .match(/([c])/gi)
        .length
}

const howManyCharactersAndPlacesHaveEveryEpisode = () => {
    episodes.forEach((episode) => {
        let charactersOfEpisode = episode.characters.length
        let origins = [... new Set(episode.characters.map((character) => {
            return characters.find((currentCharacter) => {
                return `https://rickandmortyapi.com/api/character/${currentCharacter.id}` === character
            })
        }).map((character) => character.origin.name))].filter((origin) => origin !== 'unknown')
        console.log(`Episodio "${episode.name}" tiene ${charactersOfEpisode} personajes provenientes de ${origins.length} ubicaciones:`)
        origins.forEach((origin) => console.log(`- ${origin}`))
    })
}

/**
 * 1. ¿Cuántas letras C tienen los nombres de los personajes?
 */
howManyLetterCHaveTheCharacters()
    .then((response) => console.log("Letras C de los personajes: " + response))
    .then(() => {

        /**
         * 2. ¿Cuántas  letras L tienen los nombres de las ubicaciones?
         */
        howManyLetterLHaveTheLocations()
            .then((response) => console.log("Letras L de las ubicaciones: " + response))
            .then(() => {

                /**
                 * 3. ¿Cuántas letras E tienen los nombres de los episodios?
                 */
                howManyLetterEHaveTheEpisodes()
                    .then((response) => console.log("Letras E de los episodios: " + response))
                    .then(() => {

                        /**
                         * 4.- Por cada episodio, indicar la cantidad y
                         */
                        howManyCharactersAndPlacesHaveEveryEpisode()
                    })
            })
    })
