import { render } from '@testing-library/react';
import React from 'react';
import Text from './Text';

describe('Text', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Text {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Text')).toBeTruthy();
    });
});
