import React from 'react'
import { useSpring, animated } from 'react-spring'

/**
 * Component that renders an animated div component from react-spring libary and with a set style that also contains the useSpring component from the react-spring libary. The animated div contains the props.children value.
 *
 * @component
 *
 * @param {props} props - Parameter that contains value given when function is called and is rendered within the animated.div element.
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
