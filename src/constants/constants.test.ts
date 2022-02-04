import axios from 'axios'

import allDimensies from './dimensies'

const apiUrl = process.env.REACT_APP_API_URL

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

const fetchData = (slug: string) => {
    return api
        .get(slug)
        .then(res => res.data)
        .catch(() => new Error(`Error fetching data for ${slug}`))
}

describe('Constants', () => {
    Object.keys(allDimensies)
        .filter(dimensionKey =>
            allDimensies[
                dimensionKey as keyof typeof allDimensies
            ].hasOwnProperty('CRUD_PROPERTIES')
        )
        .filter(
            dimensionKey =>
                dimensionKey !== 'VERORDENINGSARTIKEL' &&
                allDimensies[
                    dimensionKey as keyof typeof allDimensies
                ].hasOwnProperty('API_ENDPOINT_VIGEREND')
        )
        .forEach(dimensionKey => {
            it(`${dimensionKey} should return a response from the API`, async () => {
                const dimension =
                    allDimensies[dimensionKey as keyof typeof allDimensies]
                const apiURL = `${
                    'API_ENDPOINT_VIGEREND' in dimension &&
                    dimension.API_ENDPOINT_VIGEREND
                }`
                const data = await fetchData(apiURL)
                expect(data).toBeTruthy()
            }, 30000)
        })
})
