function getPropertyByName<T, K extends keyof T>(obj: T, propName: K): T[K] {
    return obj[propName]
}

export default getPropertyByName
