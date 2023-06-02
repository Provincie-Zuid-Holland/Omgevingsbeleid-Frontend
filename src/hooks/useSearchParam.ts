import { useLocation, useNavigate } from 'react-router-dom'

const useSearchParam = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(window.location.search)

    /**
     * Gets value(s) of provided param(s)
     */
    const get = (param: string | string[]) => {
        if (typeof param === 'string') {
            return [searchParams.get(param)]
        }

        return param.map(val => searchParams.get(val))
    }

    /**
     * Sets a param with provided value(s)
     */
    const set = (param: string, value: string | string[]) => {
        searchParams.delete(param)

        if (typeof value === 'string') {
            searchParams.append(param, value)
        } else if (Array.isArray(value)) {
            searchParams.append(param, value.join(','))
        }

        return navigate({
            pathname: location.pathname,
            search: `?${searchParams}`,
        })
    }

    /**
     * Remove provided param(s) from URL
     */
    const remove = (param: string | string[]) => {
        if (typeof param === 'string') {
            searchParams.delete(param)
        } else if (Array.isArray(param)) {
            param.forEach(val => searchParams.delete(val))
        }

        return navigate({
            pathname: location.pathname,
            search: `?${searchParams}`,
        })
    }

    return { get, set, remove }
}

export default useSearchParam
