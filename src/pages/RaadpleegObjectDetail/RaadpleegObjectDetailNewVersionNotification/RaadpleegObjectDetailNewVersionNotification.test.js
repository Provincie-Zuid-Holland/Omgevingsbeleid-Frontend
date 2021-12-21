import { render } from '@testing-library/react';
import React from 'react';
import RaadpleegObjectDetailNewVersionNotification from './RaadpleegObjectDetailNewVersionNotification';

describe('RaadpleegObjectDetailNewVersionNotification', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<RaadpleegObjectDetailNewVersionNotification {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RaadpleegObjectDetailNewVersionNotification')).toBeTruthy();
    });
});
