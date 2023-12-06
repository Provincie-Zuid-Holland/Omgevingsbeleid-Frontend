const generateQueryString = (
    params: Record<string, string | number | boolean>
) =>
    Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')

export default generateQueryString
