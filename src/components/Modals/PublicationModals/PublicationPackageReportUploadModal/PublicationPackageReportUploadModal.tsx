import { FormikFileUpload } from '@pzh-ui/components'
import { Form, Formik } from 'formik'

import Modal from '@/components/Modal'

const PublicationPackageReportUploadModal = () => {
    const handleSubmit = () => {}

    return (
        <Modal
            id="publicationPackageReportUpload"
            title="Upload rapporten"
            size="xl">
            <Formik initialValues={{}} onSubmit={handleSubmit}>
                <Form>
                    <FormikFileUpload name="uploaded_files" />
                </Form>
            </Formik>
        </Modal>
    )
}

export default PublicationPackageReportUploadModal
