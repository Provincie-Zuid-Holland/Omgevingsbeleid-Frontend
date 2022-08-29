import { render } from '@testing-library/react';
import React from 'react';
import VerordeningEditLoader, { VerordeningEditLoaderProps } from './VerordeningEditLoader';

describe('VerordeningEditLoader', () => {
    const defaultProps: VerordeningEditLoaderProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<VerordeningEditLoader {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('VerordeningEditLoader')).toBeTruthy();
    });
});
