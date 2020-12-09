import { render } from '@testing-library/react';
import React from 'react';
import FormFieldContainerBeleidsprestaties from './FormFieldContainerBeleidsprestaties';

describe('FormFieldContainerBeleidsprestaties', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<FormFieldContainerBeleidsprestaties {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FormFieldContainerBeleidsprestaties')).toBeTruthy();
    });
});
