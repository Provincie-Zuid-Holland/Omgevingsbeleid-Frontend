import React from "react"
import { useSpring, animated } from "react-spring"

/**
 * Displays a animated div containing content.
 *
 * @param {props} props - Contains values passed down from parent.
 */

function ContainerAnimateContent(props) {
    return (
        <animated.div
            style={useSpring({
                config: { tension: 250 },
                opacity: 1,
                transform: "scale(1)",
                from: { opacity: 0, transform: "scale(0.95)" },
            })}
        >
            {props.children}
        </animated.div>
    )
}

export default ContainerAnimateContent
