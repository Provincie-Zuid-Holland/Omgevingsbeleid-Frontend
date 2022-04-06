import { render } from '@testing-library/react';
import React from 'react';
import FormikWerkingsgebied, { FormikWerkingsgebiedProps } from './FormikWerkingsgebied';

describe('FormikWerkingsgebied', () => {
    const defaultProps: FormikWerkingsgebiedProps = {};

    it('should render', () => {
        const props = { ...defaultProps };
        const { asFragment, queryByText } = render(<FormikWerkingsgebied {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FormikWerkingsgebied')).toBeTruthy();
    });
});
