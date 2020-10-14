const axios = require('axios');

/**
 * Listados vacíos
 */
let locations = []
let episodes = []
let characters = []

/**
 * Recuperar los resultados de la API
 *
 * @param path
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
 */
const fetchLocations = async () => {
    console.time('# Cargando "Locations"')
    locations = await fetchApiResults('location')
    console.timeEnd('# Cargando "Locations"')
    return locations
}

/**
 * Recuperar los episodios
 */
const fetchEpisodes = async () => {
    console.time('# Cargando "Episodes"')
    episodes = await fetchApiResults('episode')
    console.timeEnd('# Cargando "Episodes"')
    return episodes
}

/**
 * Recuperar los personajes
 */
const fetchCharacters = async () => {
    console.time('# Cargando "Characters"')
    characters = await fetchApiResults('character')
    console.timeEnd('# Cargando "Characters"')
    return characters
}


/**
 * Contador de letras:
 * - Cuantas veces aparece la letra "l" en los nombres de las ubicaciones
 */
const howManyLetterLHaveTheLocations = () => {
    console.time('# Contando letras "l" en "Locations"')
    let count = locations
        .map((location) => location.name)
        .join('')
        .toLowerCase()
        .match(/([l])/gi)
        .length
    console.timeEnd('# Contando letras "l" en "Locations"')
    return count
}

/**
 * Contador de letras:
 * - Cuantas veces aparece la letra "e" en los nombres de las episodios
 */
const howManyLetterEHaveTheEpisodes = () => {
    console.time('# Contando letras "e" en "Episodes"')
    let count = episodes
        .map((location) => location.name)
        .join('')
        .toLowerCase()
        .match(/([e])/gi)
        .length
    console.timeEnd('# Contando letras "e" en "Episodes"')
    return count
}

/**
 * Contador de letras:
 * - Cuantas veces aparece la letra "c" en los nombres de los personajes
 */
const howManyLetterCHaveTheCharacters = () => {
    console.time('# Contando letras "c" en "Characters"')
    let count = characters
        .map((location) => location.name)
        .join('')
        .toLowerCase()
        .match(/([c])/gi)
        .length
    console.timeEnd('# Contando letras "c" en "Characters"')
    return count
}

/**
 * Contador de personajes y lugares:
 */
const howManyCharactersAndPlacesHaveEveryEpisode = () => {
    console.time('# Contando personajes y recuperando ubicaciones de los "Characters" de cada episodio')
    episodes.forEach((episode) => {
        let charactersOfEpisode = episode.characters.length
        let origins = [... new Set(episode.characters.map((character) => {
            return characters.find((currentCharacter) => {
                return `https://rickandmortyapi.com/api/character/${currentCharacter.id}` === character
            })
        }).map((character) => character.origin.name))].filter((origin) => origin !== 'unknown')
        console.warn(`Episodio "${episode.name}" tiene ${charactersOfEpisode} personajes provenientes de ${origins.length} ubicaciones:`)
        console.warn('')
        origins.forEach((origin) => console.warn(`- ${origin}`))
        console.warn('')
    })
    console.timeEnd('# Contando personajes y recuperando ubicaciones de los "Characters" de cada episodio')
}

/**
 * Correr la prueba
 */
Promise.all([
    fetchCharacters(),
    fetchLocations(),
    fetchEpisodes()
]).then(() => {
    console.time('# Tiempo de carga de algoritmos')
    console.warn('')
    console.warn("Letras C de los personajes: " + howManyLetterCHaveTheCharacters())
    console.warn("Letras L de las ubicaciones: " + howManyLetterLHaveTheLocations())
    console.warn("Letras E de los episodios: " + howManyLetterEHaveTheEpisodes())
    console.warn('')
    howManyCharactersAndPlacesHaveEveryEpisode()
    console.timeEnd('# Tiempo de carga de algoritmos')
})
