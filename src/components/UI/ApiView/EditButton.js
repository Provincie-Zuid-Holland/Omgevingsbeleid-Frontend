import React from 'react'
import { Link } from 'react-router-dom'

class EditButton extends React.Component {
    render() {
        const overzichtSlug = this.props.overzichtSlug
        const objectID = this.props.objectID

        return (
            <Link
                to={`/api-test/${overzichtSlug}/edit/${objectID}`}
                className="mt-4 mr-4 font-bold py-2 px-4 text-sm rounded bg-blue-200 text-blue-700 absolute top-0 right-0"
            >
                Edit
            </Link>
        )
    }
}

export default EditButton
