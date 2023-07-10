/**
 * These hooks re-implement the now removed useBlocker and usePrompt hooks in 'react-router-dom'.
 * Thanks for the idea @piecyk https://github.com/remix-run/react-router/issues/8139#issuecomment-953816315
 * Source: https://github.com/remix-run/react-router/commit/256cad70d3fd4500b1abcfea66f3ee622fb90874#diff-b60f1a2d4276b2a605c05e19816634111de2e8a4186fe9dd7de8e344b65ed4d3L344-L381
 */
import { useCallback, useContext, useEffect } from 'react'
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom'

function useConfirmExit(confirmExit: () => boolean, when = true) {
    const { navigator } = useContext(NavigationContext)

    useEffect(() => {
        if (!when) {
            return
        }

        const push = navigator.push

        navigator.push = (...args: Parameters<typeof push>) => {
            const result = confirmExit()
            if (result !== false) {
                push(...args)
            }
        }

        return () => {
            navigator.push = push
        }
    }, [navigator, confirmExit, when])
}

export function usePrompt(message: string, when = true) {
    useEffect(() => {
        if (when) {
            window.onbeforeunload = function () {
                return message
            }
        }

        return () => {
            window.onbeforeunload = null
        }
    }, [message, when])

    const confirmExit = useCallback(() => {
        const confirm = window.confirm(message)
        return confirm
    }, [message])

    useConfirmExit(confirmExit, when)
}
