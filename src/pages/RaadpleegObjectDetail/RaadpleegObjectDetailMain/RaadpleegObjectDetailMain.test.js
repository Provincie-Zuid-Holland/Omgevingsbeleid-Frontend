import { render } from '@testing-library/react';
import React from 'react';
import RaadpleegObjectDetailMain from './RaadpleegObjectDetailMain';

describe('RaadpleegObjectDetailMain', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<RaadpleegObjectDetailMain {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RaadpleegObjectDetailMain')).toBeTruthy();
    });
});
