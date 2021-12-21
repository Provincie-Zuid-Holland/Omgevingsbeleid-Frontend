import { render } from '@testing-library/react';
import React from 'react';
import RaadpleegObjectDetailHead from './RaadpleegObjectDetailHead';

describe('RaadpleegObjectDetailHead', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<RaadpleegObjectDetailHead {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RaadpleegObjectDetailHead')).toBeTruthy();
    });
});
