import React from "react"
import { useWindowSize } from "../../utils/useWindowSize"

/**
 *
 * @param {string} type - Text type
 * @param {object} windowSize - Contains the width and height of the screen
 * @returns {object} - Returns the styles for the appropriate screen
 */
const getStylesForElement = (type, windowSize) => {
    if (!windowSize) {
        console.error("No windowSize supplied!")
        return {}
    }

    const smallScreen = 640
    const currentScreenIsMobile = windowSize.width <= smallScreen

    if (type === "quote") {
        if (currentScreenIsMobile) {
            return {
                fontSize: "1.6rem",
                lineHeight: "1.094rem",
            }
        } else {
            return {
                fontSize: "1.667rem",
                lineHeight: "1.2rem",
            }
        }
    } else if (type === "introduction-paragraph") {
        if (currentScreenIsMobile) {
            return {
                fontSize: "1.1rem",
                lineHeight: "1.25rem",
            }
        } else {
            return { fontSize: "1.2rem", lineHeight: "1.6rem" }
        }
    } else if (type === "body") {
        if (currentScreenIsMobile) {
            return {
                fontSize: "1rem",
                lineHeight: "1.5rem",
            }
        } else {
            return { fontSize: "1rem", lineHeight: "1.5rem" }
        }
    }
}

/**
 *
 * @param {object} props - Properties
 * @param {string} type - The text element type
 * @param {string} color - The color class for the element, defaults to text-pzh-blue-dark
 * @param {object} children - Child element(s)
 * @param {string} className - Custom classes for the element
 * @returns A text element
 */
function Text({
    type,
    children,
    color = "text-pzh-blue-dark",
    className = "",
}) {
    const windowSize = useWindowSize()
    const styles = getStylesForElement(type, windowSize)

    if (type === "quote") {
        return (
            <span style={styles} className={`${color} ${className}`}>
                {children}
            </span>
        )
    } else if (type === "subtitle") {
        return (
            <p
                style={styles}
                className={`inline-block text-base leading-normal ${color} ${className}`}
            >
                {children}
            </p>
        )
    } else if (type === "introduction-paragraph") {
        return (
            <p style={styles} className={`inline-block ${color} ${className}`}>
                {children}
            </p>
        )
    } else if (type === "body") {
        return (
            <p style={styles} className={`inline-block ${color} ${className}`}>
                {children}
            </p>
        )
    } else {
        throw new Error(`${type} is not a valid text type`)
    }
}

export default Text
