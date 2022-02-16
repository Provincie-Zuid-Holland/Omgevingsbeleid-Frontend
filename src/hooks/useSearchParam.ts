const useSearchParam = (param: string | string[]) => {
    const searchParams = new URLSearchParams(window.location.search)

    if (typeof param === 'string') {
        return [searchParams.get(param)]
    }

    return param.map(val => searchParams.get(val))
}

export default useSearchParam
