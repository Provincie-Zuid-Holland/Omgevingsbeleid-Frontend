import { render } from '@testing-library/react';
import React from 'react';
import FieldsBeleidsprestatie, { FieldsBeleidsprestatieProps } from './FieldsBeleidsprestatie';

describe('FieldsBeleidsprestatie', () => {
    const defaultProps: FieldsBeleidsprestatieProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<FieldsBeleidsprestatie {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FieldsBeleidsprestatie')).toBeTruthy();
    });
});
