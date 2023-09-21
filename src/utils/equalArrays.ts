const equalArrays = (arr1: number[], arr2: number[]) =>
    arr1.length === arr2.length &&
    arr1.every((value, index) => value === arr2[index])

export default equalArrays
