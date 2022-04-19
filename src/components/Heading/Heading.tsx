import { CSSProperties, FC } from 'react'
import { useMedia } from 'react-use'

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
    const isMobile = useMedia('(max-width: 640px)')
    const styles = getHeadingStyles(level, isMobile)

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

export const getHeadingStyles = (
    level?: string,
    isMobile?: boolean
): CSSProperties => {
    if (level === '1') {
        if (isMobile) {
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
        if (isMobile) {
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
        if (isMobile) {
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
