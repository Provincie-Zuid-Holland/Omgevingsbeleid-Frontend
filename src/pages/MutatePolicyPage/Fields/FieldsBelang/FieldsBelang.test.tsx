import { render } from '@testing-library/react';
import React from 'react';
import FieldsBelang, { FieldsBelangProps } from './FieldsBelang';

describe('FieldsBelang', () => {
    const defaultProps: FieldsBelangProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<FieldsBelang {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FieldsBelang')).toBeTruthy();
    });
});
