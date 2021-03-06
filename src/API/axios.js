import axios from 'axios'

const api_version = process.env.REACT_APP_API_VERSION
const environment = process.env.REACT_APP_API_ENV

let getAccessToken = () =>
    localStorage.getItem(process.env.REACT_APP_KEY_API_ACCESS_TOKEN)

const apiURLS = {
    dev: `https://api-obzh-dev.azurewebsites.net/${api_version}`,
    test: `https://api-obzh-test.azurewebsites.net/${api_version}`,
    acc: `https://api-obzh-acc.azurewebsites.net/${api_version}`,
    prod: `https://api-obzh.azurewebsites.net/${api_version}`,
}

const instance = axios.create({
    baseURL: apiURLS[environment],
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request.use(function (config) {
    config.headers.Authorization = `Token ${getAccessToken()}`
    return config
})

instance.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        if (error && error.response && error.response.status === 401) {
            var event = new CustomEvent('authEvent', {
                detail: { message: 'Authenticated sessie is afgelopen' },
            })
            window.dispatchEvent(event)
        } else {
            return Promise.reject(error)
        }
    }
)

const baseURL = instance.defaults.baseURL
// const baseURL = 'TEST'

export { environment, baseURL }
export default instance
