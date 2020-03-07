import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class ButtonBackToPage extends Component {
    render() {
        let color = 'text-gray-600'
        if (this.props.color !== undefined) {
            color = this.props.color
        }

        return (
            <div className={`${color} text-sm w-full container mx-auto`}>
                <ul>
                    <li>
                        <Link
                            to={this.props.url}
                            className={`${color} text-l mb-4 inline-block`}
                            id="button-back-to-previous-page"
                        >
                            <FontAwesomeIcon
                                className="mr-2"
                                icon={faAngleLeft}
                            />
                            <span>Terug naar {this.props.terugNaar}</span>
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }
}

export default withRouter(ButtonBackToPage)
