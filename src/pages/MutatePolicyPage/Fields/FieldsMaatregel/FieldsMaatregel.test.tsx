import { render } from '@testing-library/react';
import React from 'react';
import FieldsMaatregel, { FieldsMaatregelProps } from './FieldsMaatregel';

describe('FieldsMaatregel', () => {
    const defaultProps: FieldsMaatregelProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<FieldsMaatregel {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FieldsMaatregel')).toBeTruthy();
    });
});
