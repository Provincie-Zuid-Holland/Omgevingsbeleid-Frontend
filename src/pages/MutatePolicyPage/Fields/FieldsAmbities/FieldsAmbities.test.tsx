import { render } from '@testing-library/react';
import React from 'react';
import FieldsAmbities, { FieldsAmbitiesProps } from './FieldsAmbities';

describe('FieldsAmbities', () => {
    const defaultProps: FieldsAmbitiesProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<FieldsAmbities {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FieldsAmbities')).toBeTruthy();
    });
});
