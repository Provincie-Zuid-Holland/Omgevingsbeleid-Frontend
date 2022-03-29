import { render } from '@testing-library/react';
import React from 'react';
import FieldsBeleidsmodule, { FieldsBeleidsmoduleProps } from './FieldsBeleidsmodule';

describe('FieldsBeleidsmodule', () => {
    const defaultProps: FieldsBeleidsmoduleProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<FieldsBeleidsmodule {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FieldsBeleidsmodule')).toBeTruthy();
    });
});
