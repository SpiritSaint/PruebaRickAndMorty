const axios = require('axios');

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
        let nextResponses = await axios.get('https://rickandmortyapi.com/api/location?page=' + currentPage)
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
    return await fetchApiResults('location')
}

/**
 * Recuperar los episodios
 *
 * @returns {Promise<*[]>}
 */
const fetchEpisodes = async () => {
    return await fetchApiResults('episode')
}

/**
 * Recuperar los personajes
 *
 * @returns {Promise<*[]>}
 */
const fetchCharacters = async () => {
    return await fetchApiResults('character')
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
    return (await fetchEpisodes())
        .map((location) => location.name)
        .join('')
        .toLowerCase()
        .match(/([c])/gi)
        .length
}

howManyLetterLHaveTheLocations().then((response) => console.log("Locations: "+ response))
howManyLetterEHaveTheEpisodes().then((response) => console.log("Episodes: " + response))
howManyLetterCHaveTheCharacters().then((response) => console.log("Characters: " + response))