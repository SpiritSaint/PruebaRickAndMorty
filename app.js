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
    let paths = []
    for (currentPage++;currentPage <= totalPages;currentPage++) {
        paths.push('https://rickandmortyapi.com/api/' + path + '?page=' + currentPage)
    }
    await axios.all(paths.map((path) => axios.get(path)))
        .then((responses) => responses
            .forEach(
                (response) => response.data.results.forEach((result) => results.push(result))
            )
        )
    return results
}

/**
 * Recuperar las ubicaciones
 */
const fetchLocations = async () => {
    locations = await fetchApiResults('location')
    return locations
}

/**
 * Recuperar los episodios
 */
const fetchEpisodes = async () => {
    episodes = await fetchApiResults('episode')
    return episodes
}

/**
 * Recuperar los personajes
 */
const fetchCharacters = async () => {
    characters = await fetchApiResults('character')
    return characters
}


/**
 * Contador de letras:
 * - Cuantas veces aparece la letra "l" en los nombres de las ubicaciones
 */
const howManyLetterLHaveTheLocations = () => {
    let count = locations
        .map((location) => location.name)
        .join('')
        .toLowerCase()
        .match(/([l])/gi)
        .length
    return count
}

/**
 * Contador de letras:
 * - Cuantas veces aparece la letra "e" en los nombres de las episodios
 */
const howManyLetterEHaveTheEpisodes = () => {
    let count = episodes
        .map((location) => location.name)
        .join('')
        .toLowerCase()
        .match(/([e])/gi)
        .length
    return count
}

/**
 * Contador de letras:
 * - Cuantas veces aparece la letra "c" en los nombres de los personajes
 */
const howManyLetterCHaveTheCharacters = () => {
    let count = characters
        .map((location) => location.name)
        .join('')
        .toLowerCase()
        .match(/([c])/gi)
        .length
    return count
}

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
 * 1. ¿Cuántas letras C tienen los nombres de los personajes?
 */
console.time('# Tiempo total de ejecución')
Promise.all([
    fetchCharacters(),
    fetchLocations(),
    fetchEpisodes()
]).then(() => {
    console.time('# Tiempo de carga de algoritmos')
    console.warn('')
    console.time('# Contando letras "c" en "Characters"')
    console.warn("Letras C de los personajes: " + howManyLetterCHaveTheCharacters())
    console.timeEnd('# Contando letras "c" en "Characters"')
    console.time('# Contando letras "l" en "Locations"')
    console.warn("Letras L de las ubicaciones: " + howManyLetterLHaveTheLocations())
    console.timeEnd('# Contando letras "l" en "Locations"')
    console.time('# Contando letras "e" en "Episodes"')
    console.warn("Letras E de los episodios: " + howManyLetterEHaveTheEpisodes())
    console.timeEnd('# Contando letras "e" en "Episodes"')
    console.warn('')
    howManyCharactersAndPlacesHaveEveryEpisode()
    console.timeEnd('# Tiempo de carga de algoritmos')
    console.timeEnd('# Tiempo total de ejecución')
})
