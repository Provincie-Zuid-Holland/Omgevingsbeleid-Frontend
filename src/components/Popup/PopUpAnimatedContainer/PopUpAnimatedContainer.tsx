import { motion } from 'framer-motion'
import { FC } from 'react'

/**
 * Displays components in an animated popup container.
 *
 * @function
 *
 * @param {boolean} small - Used to set the size of the popup.
 * @param {boolean} large - Used to set the size of the popup.
 * @param {object} children - Can contain child component(s).
 * @param {object} reference - Contains the reference of the popup.
 */

interface PopUpAnimatedContainer {
    small?: boolean
    large?: boolean
    reference?: React.RefObject<HTMLDivElement>
}

const PopUpAnimatedContainer: FC<PopUpAnimatedContainer> = ({
    small,
    large,
    children,
    reference,
}) => (
    <div>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            className="fixed top-0 left-0 z-10 w-screen h-screen bg-gray-900"
        />
        <div className="fixed top-0 left-0 z-50">
            <div className="top-0 left-0 flex items-center justify-center w-screen h-screen">
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    ref={reference}
                    className={`max-w-5xl relative bg-white rounded shadow p-6 ${
                        small
                            ? 'popup-small'
                            : large
                            ? 'popup-large'
                            : 'popup-normal'
                    }`}>
                    {children}
                </motion.div>
            </div>
        </div>
    </div>
)

export default PopUpAnimatedContainer
