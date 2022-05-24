import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import ColoredBall, { ColoredBallProps } from './ColoredBall'

describe('ColoredBall', () => {
    const defaultProps: ColoredBallProps = {
        color: 'red',
    }

    const setup = () => {
        render(<ColoredBall {...defaultProps} />)
    }

    it('Component renders', () => {
        setup()
        const coloredBall = screen.getByTestId('colored-ball')
        expect(coloredBall).toBeTruthy()
    })
})
