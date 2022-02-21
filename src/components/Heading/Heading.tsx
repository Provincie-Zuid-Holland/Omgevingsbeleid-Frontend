import { FC } from 'react'
import { useWindowSize } from 'react-use'

interface HeadingProps {
    className?: string
    id?: string
    color?: string
    level?: string
    customStyles?: any
}

const Heading: FC<HeadingProps> = ({
    className = '',
    id,
    color = 'text-pzh-blue',
    level = '1',
    children,
    customStyles,
}) => {
    const windowSize = useWindowSize()
    const styles = getHeadingStyles(level, windowSize)

    if (level === '1') {
        return (
            <h1
                style={customStyles ? customStyles : styles}
                id={id}
                className={`break-words ${color} ${className}`}>
                {children}
            </h1>
        )
    } else if (level === '2') {
        return (
            <h2
                style={customStyles ? customStyles : styles}
                id={id}
                className={`break-words ${color} ${className}`}>
                {children}
            </h2>
        )
    } else if (level === '3') {
        return (
            <h3
                style={customStyles ? customStyles : styles}
                id={id}
                className={`break-words ${color} ${className}`}>
                {children}
            </h3>
        )
    } else if (level === '4') {
        return (
            <h4
                style={customStyles ? customStyles : styles}
                id={id}
                className={`break-words ${color} ${className}`}>
                {children}
            </h4>
        )
    } else if (level === '5') {
        return (
            <h5
                style={customStyles ? customStyles : styles}
                id={id}
                className={`break-words ${color} ${className}`}>
                {children}
            </h5>
        )
    } else if (level === '6') {
        return (
            <h6
                style={customStyles ? customStyles : styles}
                id={id}
                className={`break-words ${color} ${className}`}>
                {children}
            </h6>
        )
    } else {
        throw new Error(`${level} is not a valid heading level`)
    }
}

const getHeadingStyles = (
    level?: string,
    windowSize?: { width: number; height: number }
) => {
    if (!windowSize) {
        console.error('🙈 No windowSize supplied')
        return {}
    }

    const smallScreen = 640
    const currentScreenIsMobile = windowSize.width <= smallScreen

    if (level === '1') {
        if (currentScreenIsMobile) {
            return {
                hyphens: 'manual',
                fontSize: '1.6rem',
                lineHeight: '1.75rem',
            }
        } else {
            return {
                hyphens: 'manual',
                fontSize: '2.4rem',
                lineHeight: '2.8rem',
            }
        }
    } else if (level === '2') {
        if (currentScreenIsMobile) {
            return {
                hyphens: 'manual',
                fontSize: '1.2rem',
                lineHeight: '1.6rem',
            }
        } else {
            return {
                hyphens: 'manual',
                fontSize: '1.8rem',
                lineHeight: '2.2rem',
            }
        }
    } else if (level === '3') {
        if (currentScreenIsMobile) {
            return {
                hyphens: 'manual',
                fontSize: '1.1rem',
                lineHeight: '1.5rem',
            }
        } else {
            return {
                hyphens: 'manual',
                fontSize: '1.2rem',
                lineHeight: '1.6rem',
            }
        }
    } else {
        // No custom styles yet for heading 4, 5 and 6
        return {}
    }
}

export default Heading
