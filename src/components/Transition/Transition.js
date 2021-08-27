import React from 'react'

import { CSSTransition as ReactCSSTransition } from 'react-transition-group'
import { useRef, useEffect, useContext } from 'react'

const TransitionContext = React.createContext({
    parent: {},
})

/**
 * Function that sets the initial values.
 *
 * @function
 */
function useIsInitialRender() {
    const isInitialRender = useRef(true)
    useEffect(() => {
        isInitialRender.current = false
    }, [])
    return isInitialRender.current
}

/**
 * Function that renders the CSSTransition component.
 *
 * @param {boolean} show - Contains a value used to show the component.
 * @param {string} enter - Contains a value that is used to set the style of the component.
 * @param {string} enterFrom - Contains a value that is used to set the style of the component.
 * @param {string} enterTo - Contains a value that is used to set the style of the component.
 * @param {string} leave - Contains a value that is used to set the style of the component.
 * @param {string} leaveFrom - Contains a value that is used to set the style of the component.
 * @param {string} leaveTo - Contains a value used to set the style of the component.
 * @param {boolean} appear - Contains a value used to show the ReactCSSTransition component.
 * @param {object} children - Contains the value rendered within the ReactCSSTransition component.
 */
function CSSTransition({
    show,
    enter = '',
    enterFrom = '',
    enterTo = '',
    leave = '',
    leaveFrom = '',
    leaveTo = '',
    appear,
    children,
}) {
    const enterClasses = enter.split(' ').filter((s) => s.length)
    const enterFromClasses = enterFrom.split(' ').filter((s) => s.length)
    const enterToClasses = enterTo.split(' ').filter((s) => s.length)
    const leaveClasses = leave.split(' ').filter((s) => s.length)
    const leaveFromClasses = leaveFrom.split(' ').filter((s) => s.length)
    const leaveToClasses = leaveTo.split(' ').filter((s) => s.length)

    function addClasses(node, classes) {
        classes.length && node.classList.add(...classes)
    }

    function removeClasses(node, classes) {
        classes.length && node.classList.remove(...classes)
    }

    return (
        <ReactCSSTransition
            appear={appear}
            unmountOnExit
            in={show}
            addEndListener={(node, done) => {
                node.addEventListener('transitionend', done, false)
            }}
            onEnter={(node) => {
                addClasses(node, [...enterClasses, ...enterFromClasses])
            }}
            onEntering={(node) => {
                removeClasses(node, enterFromClasses)
                addClasses(node, enterToClasses)
            }}
            onEntered={(node) => {
                removeClasses(node, [...enterToClasses, ...enterClasses])
            }}
            onExit={(node) => {
                addClasses(node, [...leaveClasses, ...leaveFromClasses])
            }}
            onExiting={(node) => {
                removeClasses(node, leaveFromClasses)
                addClasses(node, leaveToClasses)
            }}
            onExited={(node) => {
                removeClasses(node, [...leaveToClasses, ...leaveClasses])
            }}
        >
            {children}
        </ReactCSSTransition>
    )
}

/**
 * Returns the value object with parameters provided by the TransitionContext.
 *
 * @function
 *
 * @param {boolean} show - Parameter that contains the boolean value if the CSSTransition component should be shown.
 * @param {boolean} appear - Parameter that contains the boolean value if the CSSTransition component should appear.
 */
function Transition({ show, appear, ...rest }) {
    const { parent } = useContext(TransitionContext)
    const isInitialRender = useIsInitialRender()
    const isChild = show === undefined

    if (isChild) {
        return (
            <CSSTransition
                appear={parent.appear || !parent.isInitialRender}
                show={parent.show}
                {...rest}
            />
        )
    }

    return (
        <TransitionContext.Provider
            value={{
                parent: {
                    show,
                    isInitialRender,
                    appear,
                },
            }}
        >
            <CSSTransition appear={appear} show={show} {...rest} />
        </TransitionContext.Provider>
    )
}

export default Transition
