import { FC } from 'react'
import { useWindowSize } from 'react-use'

interface TextProps {
    type?: string
    color?: string
    className?: string
}

const Text: FC<TextProps> = ({
    type,
    children,
    color = 'text-pzh-blue-dark',
    className = '',
}) => {
    const windowSize = useWindowSize()
    const styles = getStylesForElement(type, windowSize)

    if (type === 'quote') {
        return (
            <span
                data-testid="quote-span"
                style={styles}
                className={`${color} ${className}`}>
                {children}
            </span>
        )
    } else if (type === 'span') {
        return (
            <span style={styles} className={`${color} ${className}`}>
                {children}
            </span>
        )
    } else if (type === 'subtitle') {
        return (
            <p
                style={styles}
                className={`inline-block text-base leading-normal ${color} ${className}`}>
                {children}
            </p>
        )
    } else if (type === 'introduction-paragraph') {
        return (
            <p style={styles} className={`inline-block ${color} ${className}`}>
                {children}
            </p>
        )
    } else if (type === 'body' || typeof type === 'undefined') {
        return (
            <p style={styles} className={`inline-block ${color} ${className}`}>
                {children}
            </p>
        )
    } else {
        throw new Error(`${type} is not a valid text type`)
    }
}

const getStylesForElement = (
    type?: string,
    windowSize?: { width: number; height: number }
) => {
    if (!windowSize) {
        console.error('No windowSize supplied!')
        return {}
    }

    const smallScreen = 640
    const currentScreenIsMobile = windowSize.width <= smallScreen

    if (type === 'quote') {
        if (currentScreenIsMobile) {
            return {
                fontSize: '1.6rem',
                lineHeight: '1.094rem',
            }
        } else {
            return {
                fontSize: '1.667rem',
                lineHeight: '1.2rem',
            }
        }
    } else if (type === 'introduction-paragraph') {
        if (currentScreenIsMobile) {
            return {
                fontSize: '1.1rem',
                lineHeight: '1.25rem',
            }
        } else {
            return { fontSize: '1.2rem', lineHeight: '1.6rem' }
        }
    } else if (type === 'body' || type === 'span') {
        if (currentScreenIsMobile) {
            return {
                fontSize: '1rem',
                lineHeight: '1.5rem',
            }
        } else {
            return { fontSize: '1rem', lineHeight: '1.5rem' }
        }
    }
}

export default Text
