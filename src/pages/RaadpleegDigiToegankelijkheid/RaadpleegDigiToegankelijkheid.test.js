import { render } from '@testing-library/react';
import React from 'react';
import RaadpleegDigiToegankelijkheid from './RaadpleegDigiToegankelijkheid';

describe('RaadpleegDigiToegankelijkheid', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<RaadpleegDigiToegankelijkheid {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RaadpleegDigiToegankelijkheid')).toBeTruthy();
    });
});
