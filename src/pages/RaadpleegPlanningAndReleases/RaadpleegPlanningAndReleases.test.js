import { render } from '@testing-library/react';
import React from 'react';
import RaadpleegPlanningAndReleases from './RaadpleegPlanningAndReleases';

describe('RaadpleegPlanningAndReleases', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<RaadpleegPlanningAndReleases {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('RaadpleegPlanningAndReleases')).toBeTruthy();
    });
});
