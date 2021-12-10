import { render } from '@testing-library/react';
import React from 'react';
import RaadpleegVerordening from './RaadpleegVerordening';

describe('RaadpleegVerordening', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<RaadpleegVerordening {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RaadpleegVerordening')).toBeTruthy();
    });
});
