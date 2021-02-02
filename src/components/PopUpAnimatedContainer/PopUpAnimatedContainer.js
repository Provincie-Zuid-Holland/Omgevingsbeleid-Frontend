import React from 'react'
import { useSpring, animated } from 'react-spring'

/**
 * Component that renders the PopUpAnimatedContainer component.
 *
 * @component
 *
 * @param {props} props - Parameter that is used to show a class small, large or normal and to display information within the animated.div.
 */
function PopUpAnimatedContainer(props) {
    return (
        <React.Fragment>
            <animated.div
                className="fixed top-0 left-0 z-10 w-screen h-screen bg-gray-900"
                style={useSpring({
                    config: { tension: 300 },
                    opacity: 0.25,
                    from: { opacity: 0 },
                })}
            />
            <div className="fixed top-0 left-0 z-10">
                <div className="top-0 left-0 flex items-center justify-center w-screen h-screen">
                    <animated.div
                        style={useSpring({
                            config: { tension: 300 },
                            transform: 'scale(1)',
                            from: { transform: 'scale(0.75)' },
                        })}
                        className={`max-w-5xl relative bg-white rounded shadow px-8 py-8 ${
                            props.small
                                ? 'popup-small'
                                : props.large
                                ? 'popup-large'
                                : 'popup-normal'
                        }`}
                    >
                        {props.children}
                    </animated.div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default PopUpAnimatedContainer
