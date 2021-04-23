import React from 'react'

/**
 * Component that renders the HeadingMain component, while using the variables titel and status, which are passed down from the parent.
 * The component displays a div containing a h1 tag containing the titel variable (passed down from the parent) and uses the status variable in the
 * conditional operator to either display the status or not. Based on the isVigerend variable (which is set true if the status contains a certain value),
 * the color and border color of the status is set.
 *
 * This component is imported by the following component:
 * ContainerDetailMain
 *
 * This component is imported by the following page:
 * ContainerDetail
 *
 * @component
 *
 * @param {string} titel - Parameter displaying the titel within the component within the h1 tags, which value is passed down from the parent.
 * @param {string} status - Parameter used in a conditional operator to check if the isVigerend variable can be set to true, also used in a conditional operator to display the status variable within the component.
 */
const HeadingMain = ({ titel, status }) => {
    const isVigerend = status === 'Vigerend' || status === 'Gepubliceerd'

    return (
        <div className="relative">
            <h1 className="inline-block text-xl font-bold text-gray-800">
                <span className="mr-4">{titel}</span>
            </h1>
            {status ? (
                <span
                    id="object-status"
                    className={`inline-block font-bold relative -mt-4 px-2 pt-2 pb-1 text-xs border rounded ${
                        isVigerend
                            ? 'text-pzh-blue border-pzh-blue'
                            : 'text-pzh-yellow-dark border-pzh-yellow-dark'
                    }`}
                >
                    {status}
                </span>
            ) : null}
        </div>
    )
}

export default HeadingMain
