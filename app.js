const axios = require('axios');

/**
 * Recuperar las ubicaciones
 */
const fetchLocations = async () => {
    let currentPage = 1
    let locations = []
    let firstResponse = await axios.get('https://rickandmortyapi.com/api/location')
    let totalPages = firstResponse.data.info.pages
    firstResponse.data.results.forEach((location) => locations.push(location))
    for (currentPage++;currentPage <= totalPages;currentPage++) {
        let nextResponses = await axios.get('https://rickandmortyapi.com/api/location?page=' + currentPage)
        nextResponses.data.results.forEach((location) => locations.push(location))
    }
    return locations
}

/**
 * Contador de letras:
 * - Cuantas veces aparece la letra "l" en los nombres de las ubicaciones
 */
const howManyLetterLHaveTheLocations = async () => {
    return (await fetchLocations())
        .map((location) => location.name)
        .join('')
        .toLowerCase()
        .match(/([l])/gi)
        .length
}

howManyLetterLHaveTheLocations().then((response) => console.log(response))