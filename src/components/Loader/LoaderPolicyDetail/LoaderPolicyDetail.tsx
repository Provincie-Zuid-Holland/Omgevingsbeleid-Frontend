import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import ContentLoader from 'react-content-loader'

const LoaderPolicyDetail = ({ className = '' }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, top: 5 }}
                animate={{ opacity: 1, scale: 1, top: 0 }}
                exit={{ opacity: 0, scale: 1, top: 5 }}
                className="relative">
                <ContentLoader className={classNames(`w-full`, className)}>
                    <rect x="0" y="0" rx="5" ry="5" width="100%" height="150" />
                </ContentLoader>
            </motion.div>
        </AnimatePresence>
    )
}

export default LoaderPolicyDetail
