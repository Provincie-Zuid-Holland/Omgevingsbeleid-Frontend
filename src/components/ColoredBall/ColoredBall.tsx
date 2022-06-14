import { motion } from 'framer-motion'
import React from 'react'

export type ColoredBallProps = {
    color: 'red' | 'green'
    className?: string
    style?: React.CSSProperties
    animated?: boolean
}

const ColoredBall = ({
    color,
    className = '',
    style = {},
    animated = false,
}: ColoredBallProps) => (
    <div className="relative flex items-center" data-testid="colored-ball">
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute block rounded-full ${
                color === 'red'
                    ? 'bg-pzh-red-light'
                    : color === 'green'
                    ? 'bg-pzh-green-light'
                    : ''
            }  ${className}`}
            style={{
                width: '14px',
                height: '14px',
                ...style,
            }}>
            {animated ? (
                <>
                    <div
                        style={{
                            width: '18px',
                            height: '18px',
                            left: '-2px',
                            top: '-2px',
                        }}
                        className={`absolute top-0 left-0 border-2 rounded-full animate-pulsate border-pzh-${color}-light`}
                    />
                    <div
                        style={{
                            width: '22px',
                            height: '22px',
                            left: '-4px',
                            top: '-4px',
                        }}
                        className={`absolute top-0 left-0 border-2 rounded-full animate-pulsate border-pzh-${color}-light border-opacity-20`}
                    />
                </>
            ) : null}
        </motion.div>
    </div>
)

export default ColoredBall
