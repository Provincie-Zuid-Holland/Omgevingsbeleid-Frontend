import React from 'react'

import { CSSTransition as ReactCSSTransition } from 'react-transition-group'
import { useRef, useEffect, useContext } from 'react'

const TransitionContext = React.createContext({
    parent: {},
})

/**
 * Function that sets the isInitialRender const and returns the current value of it.
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
 * @function
 *
 * @param {boolean} show - Parameter that is set true if the ReactCSSTransition is shown.
 * @param {string} enter - Parameter that contains a value that is used to set the length of the enterClasses variable.
 * @param {string} enterFrom - Parameter that contains a value that is used to set the length of the enterFromClasses variable.
 * @param {string} enterTo - Parameter that contains a value that is used to set the length of the enterToClasses variable.
 * @param {string} leave - Parameter that contains a value that is used to set the length of the leaveClasses variable.
 * @param {string} leaveFrom - Parameter that contains a value that is used to set the length of the leaveFromClasses variable.
 * @param {string} leaveTo - Parameter that contains a value that is used to set the length of the leaveToClasses variable.
 * @param {boolean} appear - Parameter that is set true if the ReactCSSTransition should appear.
 * @param {object} children - Parameter containing the value within the ReactCSSTransition component.
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
 * Component that renders the Transition component, using the CSSTransition and TransistionContext.Provider components.
 *
 * @function
 *
 * @param {boolean} show - Parameter that is set true, will show the CSSTransition in the component and is part of the value of the TransitionContext.Provider component.
 * @param {boolean} appear - Parameter that is set true, if the CSSTransition component should appear and is part of the value of the TransitionContext.Provider component.
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
