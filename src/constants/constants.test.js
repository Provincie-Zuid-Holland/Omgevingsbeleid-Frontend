import axios from "axios"
import allDimensies from "./../constants/dimensies"

const api = axios.create({
    baseURL: "https://api-obzh-dev.azurewebsites.net/v0.1/",
    headers: {
        "Content-Type": "application/json",
    },
})

const fetchData = (slug) => {
    return api
        .get(slug)
        .then((res) => res.data)
        .catch(
            (err) =>
                new Error(`Error fetching data for ${slug} - message: `, err)
        )
}

describe("Constants", () => {
    Object.keys(allDimensies)
        .filter((dimensionKey) =>
            allDimensies[dimensionKey].hasOwnProperty("CRUD_PROPERTIES")
        )
        .filter(
            (dimensionKey) =>
                dimensionKey !== "VERORDENINGSARTIKEL" &&
                allDimensies[dimensionKey].hasOwnProperty(
                    "API_ENDPOINT_VIGEREND"
                )
        )
        .forEach((dimensionKey) => {
            it(`${dimensionKey} should return a response from the API`, async () => {
                const dimension = allDimensies[dimensionKey]
                const apiURL = `${dimension.API_ENDPOINT_VIGEREND}`
                const data = await fetchData(apiURL)
                expect(data).toBeTruthy()
            }, 30000)
        })
})
