import { FC } from 'react'
import { useSpring, animated } from 'react-spring'

/**
 * Displays a animated div containing content.
 */

const ContainerAnimateContent: FC = ({ children }) => (
    <animated.div
        style={useSpring({
            config: { tension: 250 },
            opacity: 1,
            transform: 'scale(1)',
            from: { opacity: 0, transform: 'scale(0.95)' },
        })}>
        {children}
    </animated.div>
)

export default ContainerAnimateContent
