import {
    DocumentType,
    PackageType,
    PublicationType,
    ReportStatusType,
} from '@/api/fetchers.schemas'
import { getStatus } from '@/components/Publications/PublicationPackages/components/utils'
import { FormikSelect } from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useSearchParams } from 'react-router-dom'
import { config } from '../../config'

interface Filter {
    publication_type?: PublicationType
    document_type?: DocumentType
    package_type?: PackageType
    report_status?: ReportStatusType
    module_id?: number
}

interface FilterProps {
    setFilter: (filter: Filter) => void
}

const Filter = ({ setFilter }: FilterProps) => {
    const [searchParams] = useSearchParams()

    const initialValues: Filter = {
        publication_type:
            (searchParams.get('publication_type') as PublicationType) ||
            undefined,
        document_type:
            (searchParams.get('document_type') as DocumentType) || undefined,
        package_type:
            (searchParams.get('package_type') as PackageType) || undefined,
        report_status:
            (searchParams.get('report_status') as ReportStatusType) ||
            undefined,
    }

    const publicationTypeOptions = Object.entries(PublicationType).map(
        ([, value]) => ({
            label: config.publicationType[value].label,
            value,
        })
    )

    const documentTypeOptions = Object.entries(DocumentType).map(
        ([, value]) => ({
            label: config.documentType[value].label,
            value,
        })
    )

    const packageTypeOptions = Object.entries(PackageType).map(([, value]) => ({
        label: config.packageType[value].label,
        value,
    }))

    const reportStatusOptions = Object.entries(ReportStatusType)
        .map(([, value]) => ({
            label: getStatus(value)?.text,
            value,
        }))
        .filter(e => e.value !== 'not_applicable')

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={setFilter}>
            {({ submitForm }) => (
                <Form className="flex flex-col gap-x-4 gap-y-2 sm:flex-row">
                    <div className="flex-1">
                        <FormikSelect
                            name="publication_type"
                            label="Soort"
                            placeholder="Kies een soort"
                            options={publicationTypeOptions}
                            isClearable
                            noOptionsMessage={({ inputValue }) =>
                                !!inputValue && 'Geen resultaten gevonden'
                            }
                            onChange={submitForm}
                        />
                    </div>
                    <div className="flex-1">
                        <FormikSelect
                            name="document_type"
                            label="Instrument"
                            placeholder="Kies een instrument"
                            options={documentTypeOptions}
                            isClearable
                            noOptionsMessage={({ inputValue }) =>
                                !!inputValue && 'Geen resultaten gevonden'
                            }
                            onChange={submitForm}
                        />
                    </div>
                    <div className="flex-1">
                        <FormikSelect
                            name="package_type"
                            label="Type"
                            placeholder="Kies een type"
                            options={packageTypeOptions}
                            isClearable
                            noOptionsMessage={({ inputValue }) =>
                                !!inputValue && 'Geen resultaten gevonden'
                            }
                            onChange={submitForm}
                        />
                    </div>
                    <div className="flex-1">
                        <FormikSelect
                            name="report_status"
                            label="Status"
                            placeholder="Kies een status"
                            options={reportStatusOptions}
                            isClearable
                            noOptionsMessage={({ inputValue }) =>
                                !!inputValue && 'Geen resultaten gevonden'
                            }
                            onChange={submitForm}
                        />
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default Filter
