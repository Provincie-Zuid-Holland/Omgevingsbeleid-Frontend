import dimensions from '@/constants/dimensies'

const getPluralFromSingular = (singular: string) => {
    const dimension = Object.keys(dimensions).find(dimension => {
        return (
            dimensions[dimension as keyof typeof dimensions].TITLE_SINGULAR ===
            singular
        )
    })

    if (dimension) {
        return dimensions[dimension as keyof typeof dimensions].TITLE_PLURAL
    } else {
        return null
    }
}

export default getPluralFromSingular
