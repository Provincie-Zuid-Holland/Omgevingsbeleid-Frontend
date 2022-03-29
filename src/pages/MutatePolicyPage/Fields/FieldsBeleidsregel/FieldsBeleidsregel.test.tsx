import { render } from '@testing-library/react';
import React from 'react';
import FieldsBeleidsregel, { FieldsBeleidsregelProps } from './FieldsBeleidsregel';

describe('FieldsBeleidsregel', () => {
    const defaultProps: FieldsBeleidsregelProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<FieldsBeleidsregel {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FieldsBeleidsregel')).toBeTruthy();
    });
});
