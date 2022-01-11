const getResponsiveImageHeight = () => {
    const screenWidth = window.screen.width
    const isLarge = screenWidth > 1024
    const isMedium = screenWidth < 1024 && screenWidth > 640
    const responsiveHeight = isLarge ? 522 : isMedium ? 300 : 250

    return {
        height: responsiveHeight + "px",
    }
}

const getResponsiveImageOffset = () => {
    const screenWidth = window.screen.width
    const isLarge = screenWidth > 1024
    const isMedium = screenWidth < 1024 && screenWidth > 640

    return {
        marginTop: !isLarge && !isMedium ? "250px" : "0px",
    }
}

export { getResponsiveImageHeight, getResponsiveImageOffset }
