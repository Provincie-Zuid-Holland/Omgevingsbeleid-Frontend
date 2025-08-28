import {
    DocumentType,
    PackageType,
    PublicationType,
    ReportStatusType,
} from '@/api/fetchers.schemas'
import { getPackageStatus } from '@/components/Publications/PublicationPackages/components/utils'
import { FormikSelect } from '@pzh-ui/components'
import { Form, Formik, FormikProps } from 'formik'
import { useEffect } from 'react'
import { config } from '../../config'

export interface Filter {
    publication_type?: PublicationType
    document_type?: DocumentType
    package_type?: PackageType
    report_status?: ReportStatusType
    module_id?: number
}

interface FilterProps {
    filter: Filter
    setFilter: (filter: Filter) => void
}

const Filter = ({ filter, setFilter }: FilterProps) => (
    <Formik initialValues={filter} enableReinitialize onSubmit={setFilter}>
        {props => <InnerForm filter={filter} {...props} />}
    </Formik>
)

const InnerForm = ({
    submitForm,
    values,
    setValues,
    filter,
}: Pick<FilterProps, 'filter'> & FormikProps<Filter>) => {
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
            label: getPackageStatus(value)?.text,
            value,
        }))
        .filter(e => e.value !== 'not_applicable')

    useEffect(() => {
        submitForm()
    }, [values])

    return (
        <Form className="flex flex-col gap-x-4 gap-y-2 sm:flex-row">
            <div className="flex-1">
                <FormikSelect
                    name="publication_type"
                    label="Soort"
                    placeholder="Kies een soort"
                    options={publicationTypeOptions}
                    key={values.publication_type ?? null}
                    isClearable
                    noOptionsMessage={({ inputValue }) =>
                        !!inputValue && 'Geen resultaten gevonden'
                    }
                />
            </div>
            <div className="flex-1">
                <FormikSelect
                    name="document_type"
                    label="Instrument"
                    placeholder="Kies een instrument"
                    options={documentTypeOptions}
                    key={values.document_type ?? null}
                    isClearable
                    noOptionsMessage={({ inputValue }) =>
                        !!inputValue && 'Geen resultaten gevonden'
                    }
                />
            </div>
            <div className="flex-1">
                <FormikSelect
                    name="package_type"
                    label="Type"
                    placeholder="Kies een type"
                    options={packageTypeOptions}
                    key={values.package_type ?? null}
                    isClearable
                    noOptionsMessage={({ inputValue }) =>
                        !!inputValue && 'Geen resultaten gevonden'
                    }
                />
            </div>
            <div className="flex-1">
                <FormikSelect
                    name="report_status"
                    label="Status"
                    placeholder="Kies een status"
                    options={reportStatusOptions}
                    key={values.report_status ?? null}
                    isClearable
                    noOptionsMessage={({ inputValue }) =>
                        !!inputValue && 'Geen resultaten gevonden'
                    }
                />
            </div>
        </Form>
    )
}

export default Filter
