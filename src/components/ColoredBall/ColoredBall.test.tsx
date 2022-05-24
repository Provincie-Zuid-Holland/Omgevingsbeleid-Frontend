import { render } from '@testing-library/react'
import React from 'react'

import ColoredBall, { ColoredBallProps } from './ColoredBall'

describe('ColoredBall', () => {
    const defaultProps: ColoredBallProps = {
        color: 'red',
    }

    it('should render', () => {
        const props = { ...defaultProps }
        const { asFragment, queryByText } = render(<ColoredBall {...props} />)

        expect(asFragment()).toMatchSnapshot()
        expect(queryByText('ColoredBall')).toBeTruthy()
    })
})
