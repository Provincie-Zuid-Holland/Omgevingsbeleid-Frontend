import { render } from '@testing-library/react';
import React from 'react';
import RaadpleegTerinzageleggingen from './RaadpleegTerinzageleggingen';

describe('RaadpleegTerinzageleggingen', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<RaadpleegTerinzageleggingen {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RaadpleegTerinzageleggingen')).toBeTruthy();
    });
});
