import axios from 'axios'

// Oude Base URL:
// baseURL: `https://api-acctest-ob.westeurope.cloudapp.azure.com/dev/${api_version}`,

// Nieuwe Base URL:
// baseURL: `https://api-obzh-test.azurewebsites.net/${api_version}`,

const access_token = localStorage.getItem('access_token')
const api_version = 'v0.1'
const instance = axios.create({
    baseURL: `https://api-obzh-test.azurewebsites.net/${api_version}`,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${access_token}`,
    },
})

instance.interceptors.request.use(function(config) {
    const access_token = localStorage.getItem('access_token')
    config.headers.Authorization = `Token ${access_token}`
    return config
})

instance.interceptors.response.use(
    function(response) {
        return response
    },
    function(error) {
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

export default instance
