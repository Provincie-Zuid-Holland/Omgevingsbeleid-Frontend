import axios from 'axios'

const api_version = 'v0.1'
const environment = 'dev'
const apiURLS = {
    dev: `https://api-obzh-dev.azurewebsites.net/${api_version}`,
    test: `https://api-obzh-test.azurewebsites.net/${api_version}`,
    acc: `https://api-obzh-acc.azurewebsites.net/${api_version}`,
    prod: `https://api-obzh.azurewebsites.net/${api_version}`,
}

const access_token = localStorage.getItem('__OB_access_token__')
const instance = axios.create({
    baseURL: apiURLS[environment],
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${access_token}`,
    },
})

instance.interceptors.request.use(function (config) {
    const access_token = localStorage.getItem('__OB_access_token__')
    config.headers.Authorization = `Token ${access_token}`
    return config
})

instance.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        if (error.response.status === 401) {
            var event = new CustomEvent('authEvent', {
                detail: { message: 'Authenticated sessie is afgelopen' },
            })
            window.dispatchEvent(event)
        } else {
            return Promise.reject(error)
        }
    }
)

export { environment }
export default instance
