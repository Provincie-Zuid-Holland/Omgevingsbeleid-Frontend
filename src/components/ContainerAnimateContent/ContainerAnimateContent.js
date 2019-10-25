import React from 'react'
import { useSpring, animated } from 'react-spring'

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
