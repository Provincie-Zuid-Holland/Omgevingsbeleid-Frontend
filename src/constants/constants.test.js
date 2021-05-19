import axios from 'axios'
import allDimensies from './../constants/dimensies'

const api = axios.create({
    baseURL: 'https://api-obzh-dev.azurewebsites.net/v0.1/',
    headers: {
        'Content-Type': 'application/json',
    },
})

const fetchData = (slug) => {
    return api
        .get(slug)
        .then((res) => res.data)
        .catch((err) => console.log(`Error with ${slug}`))
}

describe('Constants', () => {
    Object.keys(allDimensies)
        .filter((dimensionKey) =>
            allDimensies[dimensionKey].hasOwnProperty('CRUD_PROPERTIES')
        )
        .forEach((dimensionKey) => {
            it(`The ${dimensionKey} constant properties should also exist on the API object`, async () => {
                const dimension = allDimensies[dimensionKey]
                const apiURL = `${dimension.API_ENDPOINT}`
                const crudProperties = Object.keys(dimension.CRUD_PROPERTIES)
                const data = await fetchData(apiURL)

                if (data === undefined || data.length === 0) return

                const firstObject = data[0]

                // Check that it has the crud properties
                crudProperties.forEach((property) => {
                    const hasProperty = firstObject.hasOwnProperty(property)
                    if (!hasProperty) {
                        console.log(
                            `Property ${property} is not here`,
                            firstObject
                        )
                    }
                    expect(hasProperty).toBe(true)
                })
            })
        })
})
