import React from 'react'

import Transition from './../Transition'

const TransitionDefault = ({ show, children }) => {
    return (
        <Transition
            show={show}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95 -translate-y-5 transform"
            enterTo="opacity-100 scale-100 translate-y-0 transform"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100 translate-y-0 transform"
            leaveTo="opacity-0 scale-95 -translate-y-5 transform"
        >
            {children}
        </Transition>
    )
}

export default TransitionDefault
