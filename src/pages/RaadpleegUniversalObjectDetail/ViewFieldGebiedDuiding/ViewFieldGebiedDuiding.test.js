import { render } from '@testing-library/react';
import React from 'react';
import ViewFieldGebiedDuiding from './ViewFieldGebiedDuiding';

describe('ViewFieldGebiedDuiding', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<ViewFieldGebiedDuiding {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('ViewFieldGebiedDuiding')).toBeTruthy();
    });
});
