import { Helmet } from 'react-helmet'

interface RaadpleegObjectDetailHeadProps {
    dataObject?: any
    titleSingular: string
}

const RaadpleegObjectDetailHead = ({
    dataObject,
    titleSingular,
}: RaadpleegObjectDetailHeadProps) => {
    const getTitle = () => {
        if (!dataObject) return ''
        return `${dataObject.Titel} (${titleSingular}) - Omgevingsbeleid Provincie Zuid-Holland`
    }

    return (
        <Helmet>
            <title>{getTitle()}</title>
            <style type="text/css">{`
            @media print {
                #raadpleeg-detail-sidebar,
                #raadpleeg-detail-werkingsgebied,
                #navigation-main,
                #raadpleeg-detail-container-meta-info {
                    display: none;
                }
                #raadpleeg-detail-container-main {
                    margin-top: 0px;
                }
                #raadpleeg-detail-container-content {
                    width: 100%;
                }
                #raadpleeg-detail-header-one {
                    margin-bottom: 2rem;
                }
            }                     
        `}</style>
        </Helmet>
    )
}

export default RaadpleegObjectDetailHead
