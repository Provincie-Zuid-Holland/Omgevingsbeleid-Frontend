import { render } from '@testing-library/react';
import React from 'react';
import FieldsThema, { FieldsThemaProps } from './FieldsThema';

describe('FieldsThema', () => {
    const defaultProps: FieldsThemaProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<FieldsThema {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FieldsThema')).toBeTruthy();
    });
});
