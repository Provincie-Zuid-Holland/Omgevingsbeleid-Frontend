import { Container } from '@/components/Container'
import Footer from '@/components/Footer'
import Heading from '@/components/Heading'
import Text from '@/components/Text'

const RaadpleegMapSearch = () => (
    <>
        <Container>
            <div className="col-span-6 mt-0 lg:mb-8 lg:col-span-3">
                <Heading level="1" className="mt-4 sm:mt-12 lg:mt-16">
                    Test
                </Heading>
                <Text type="introduction-paragraph" className="mt-3">
                    Als beleidsmedewerker van provincie Zuid-Holland kunt u hier
                    inloggen om te werken aan het Omgevingsbeleid.
                </Text>
            </div>
        </Container>

        <Footer />
    </>
)

export default RaadpleegMapSearch
