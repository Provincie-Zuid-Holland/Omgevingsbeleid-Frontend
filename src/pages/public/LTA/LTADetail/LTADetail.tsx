import { Heading, Text } from '@pzh-ui/components'

import TableAccordion from '../TableAccordion'

function LTADetail() {
    return (
        <>
            <Heading as="1" level="1" className="mt-10">
                Detail page
            </Heading>
            <Text type="introduction-paragraph" className="mt-3">
                Detail page content
            </Text>

            <TableAccordion
                ariaLabel="test"
                titleHeader="Beleidsproducten"
                cellHeaders={['Status', 'Aanbieden PS']}>
                <TableAccordion.Row
                    title="Beleidsproduct 1"
                    cells={['In ontwikkeling', 'Ja']}>
                    <p>Beleidsproduct 1 content</p>
                </TableAccordion.Row>
                <TableAccordion.Row
                    title="Beleidsproduct 1"
                    cells={['In ontwikkeling', 'Ja']}>
                    <p>Beleidsproduct 1 content</p>
                </TableAccordion.Row>
                <TableAccordion.Row
                    title="Beleidsproduct 1"
                    cells={['In ontwikkeling', 'Ja']}>
                    <p>Beleidsproduct 1 content</p>
                </TableAccordion.Row>
            </TableAccordion>
        </>
    )
}

export default LTADetail
