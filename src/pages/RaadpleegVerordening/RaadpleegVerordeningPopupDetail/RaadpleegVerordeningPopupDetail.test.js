import { render } from '@testing-library/react';
import React from 'react';
import RaadpleegVerordeningPopupDetail from './RaadpleegVerordeningPopupDetail';

describe('RaadpleegVerordeningPopupDetail', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<RaadpleegVerordeningPopupDetail {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RaadpleegVerordeningPopupDetail')).toBeTruthy();
    });
});
