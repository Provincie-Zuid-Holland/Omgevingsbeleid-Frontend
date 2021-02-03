import React from 'react'
import { useSpring, animated } from 'react-spring'

/**
 * Component that renders an animated div containing a set style.
 *
 * @component
 *
 * @param {props} props - Parameter that contains a certain value used in the component.
 */

function ContainerAnimateContent(props) {
    return (
        <animated.div
            style={useSpring({
                config: { tension: 250 },
                opacity: 1,
                transform: 'scale(1)',
                from: { opacity: 0, transform: 'scale(0.95)' },
            })}
        >
            {props.children}
        </animated.div>
    )
}

export default ContainerAnimateContent
