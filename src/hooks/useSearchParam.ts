const useSearchParam = (param: string) => {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get(param)
}

export default useSearchParam
