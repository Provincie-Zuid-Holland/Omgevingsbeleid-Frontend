import { render } from '@testing-library/react';
import React from 'react';
import RaadpleegInProgress from './RaadpleegInProgress';

describe('RaadpleegInProgress', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<RaadpleegInProgress {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RaadpleegInProgress')).toBeTruthy();
    });
});
