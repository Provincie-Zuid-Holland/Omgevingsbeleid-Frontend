import { render } from '@testing-library/react';
import React from 'react';
import FieldsVerordening, { FieldsVerordeningProps } from './FieldsVerordening';

describe('FieldsVerordening', () => {
    const defaultProps: FieldsVerordeningProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<FieldsVerordening {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FieldsVerordening')).toBeTruthy();
    });
});
