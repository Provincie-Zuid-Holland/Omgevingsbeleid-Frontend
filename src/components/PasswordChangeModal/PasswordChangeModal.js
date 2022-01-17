import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons'
import { faTimes } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@headlessui/react'
import { useEffect, useRef, useState } from 'react'
import { useKey, useLockBodyScroll } from 'react-use'

import axios from '../../api/axios'
import { LoaderSpinner } from '../Loader'
import { PopUpAnimatedContainer } from '../Popup'

/**
 * A modal to change the users password
 * @param {object} props
 * @param {function} props.setOpen - Function to set the open state of the modal
 */
export default function PasswordChangeModal({ setOpen }) {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [copyOfNewPassword, setCopyOfNewPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState([])
    const [copyError, setCopyError] = useState(false)
    const [currentPasswordError, setCurrentPasswordError] = useState(false)

    const currentPasswordInput = useRef(null)
    const mailToAnchor = useRef(null)
    const closeBtn = useRef(null)
    const container = useRef(null)

    useKey('Escape', () => setOpen(false))

    useLockBodyScroll(true)

    const handleSubmit = e => {
        e.preventDefault()
        setCopyError(false)
        setCurrentPasswordError(false)
        setLoading(true)

        if (newPassword !== copyOfNewPassword) {
            setCopyError(true)
            setLoading(false)
            return
        }

        axios
            .post('password-reset', {
                password: currentPassword,
                new_password: newPassword,
            })
            .then(() => {
                setLoading(false)
                setOpen(false)
            })
            .catch(error => {
                if (error?.response?.status === 401) {
                    setLoading(false)
                    setCurrentPasswordError(true)
                } else {
                    setLoading(false)
                    setErrors(error.response.data.errors)
                }
            })
    }

    useEffect(() => {
        const mailToAnchorEl = mailToAnchor?.current
        const closeBtnEl = closeBtn?.current
        const currentPasswordInput = document.getElementById(
            'password-reset-current-password'
        )
        currentPasswordInput.focus()

        const handleKeyEvent = e => {
            if (e.shiftKey && e.code === 'Tab') {
                mailToAnchorEl.focus()
            } else if (e.code === 'Tab') {
                closeBtnEl.focus()
            }
        }

        mailToAnchorEl.addEventListener('keydown', handleKeyEvent)
        closeBtnEl.addEventListener('keydown', handleKeyEvent)

        return () => {
            closeBtnEl.removeEventListener('keydown', handleKeyEvent)
            mailToAnchorEl.removeEventListener('keydown', handleKeyEvent)
        }
    }, [])

    return (
        <PopUpAnimatedContainer small={true} reference={container}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                    Wachtwoord wijzigen
                </h3>
                <button
                    ref={closeBtn}
                    onKeyDown={e => {
                        if (e.code === 'Enter') setOpen(false)
                    }}
                    onClick={() => setOpen(false)}
                    className="py-1 pl-3 pr-1 text-gray-600 cursor-pointer hover:text-gray-800 pzh-transition-colors"
                    id={`password-reset-close`}
                    tabIndex="0">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <label className="block mt-4">
                    <span className="font-bold text-gray-700">
                        Huidige wachtwoord<sup className="text-pzh-red">*</sup>
                    </span>
                    <input
                        ref={currentPasswordInput}
                        required={true}
                        id={`password-reset-current-password`}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className={`block w-full px-4 pt-2 pb-1 mt-1 leading-tight text-gray-700 border appearance-none focus:outline-none ${
                            currentPasswordError
                                ? 'border-pzh-yellow rounded-t hover:border-pzh-yellow focus:border-pzh-yellow'
                                : 'border-gray-400 rounded hover:border-gray-500 focus:border-gray-500'
                        }`}
                        type="password"
                        placeholder="Voer hier je huidige wachtwoord in"
                    />
                    <Transition
                        show={currentPasswordError}
                        enter="transition ease-out duration-500"
                        enterFrom="opacity-0 -translate-y-5 scale-90"
                        enterTo="opacity-100 translate-y-0 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 scale-100"
                        leaveTo="opacity-0 -translate-y-5 scale-90">
                        <ul className="px-4 pt-1 pb-3 text-sm rounded-b text-pzh-blue-dark bg-pzh-yellow">
                            <li className="pt-2">
                                Het ingevoerde huidige wachtwoord is onjuist,
                                probeer het opnieuw
                            </li>
                        </ul>
                    </Transition>
                </label>

                <div className="flex items-start px-4 py-3 mt-4 bg-pzh-blue-light bg-opacity-20">
                    <div className="pt-1 pr-4">
                        <FontAwesomeIcon
                            className="text-md"
                            icon={faInfoCircle}
                        />
                    </div>
                    <p className="text-sm">
                        Het nieuwe wachtwoord moet minimaal 12 karakters
                        bevatten en moet ten minste 1 cijfer, 1 speciaal
                        karakter en 1 hoofdletter bevatten.
                    </p>
                </div>

                <label className="block mt-4">
                    <span className="font-bold text-gray-700">
                        Nieuw wachtwoord<sup className="text-pzh-red">*</sup>
                    </span>
                    <input
                        id={`password-reset-new-password`}
                        required={true}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className={`block w-full px-4 pt-2 pb-1 mt-1 leading-tight text-gray-700 border appearance-none focus:outline-none ${
                            errors.length > 0
                                ? 'border-pzh-yellow rounded-t hover:border-pzh-yellow focus:border-pzh-yellow'
                                : 'border-gray-400 rounded hover:border-gray-500 focus:border-gray-500'
                        }`}
                        type="password"
                        placeholder="Geef hier het nieuwe wachtwoord op"
                    />
                    <Transition
                        show={errors.length > 0}
                        enter="transition ease-out duration-500"
                        enterFrom="opacity-0 -translate-y-5 scale-90"
                        enterTo="opacity-100 translate-y-0 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 scale-100"
                        leaveTo="opacity-0 -translate-y-5 scale-90">
                        <ul className="px-4 pt-1 pb-3 text-sm rounded-b text-pzh-blue-dark bg-pzh-yellow">
                            <li className="pt-2">Het wachtwoord moet...</li>
                            {errors.map((error, index) => (
                                <li key={`error-${index}`} className="pt-2">
                                    ...{error}
                                </li>
                            ))}
                        </ul>
                    </Transition>
                </label>

                <label className="block mt-4">
                    <span className="font-bold text-gray-700">
                        Herhaal nieuw wachtwoord
                        <sup className="text-pzh-red">*</sup>
                    </span>
                    <input
                        required={true}
                        id={`password-reset-copy-new-password`}
                        value={copyOfNewPassword}
                        onChange={e => setCopyOfNewPassword(e.target.value)}
                        className={`block w-full px-4 pt-2 pb-1 mt-1 leading-tight text-gray-700 border appearance-none focus:outline-none ${
                            copyError
                                ? 'border-pzh-yellow rounded-t hover:border-pzh-yellow focus:border-pzh-yellow'
                                : 'border-gray-400 rounded hover:border-gray-500 focus:border-gray-500'
                        }`}
                        type="password"
                        placeholder="Herhaal het nieuwe wachtwoord"
                    />
                    <Transition
                        show={copyError}
                        enter="transition ease-out duration-500"
                        enterFrom="opacity-0 -translate-y-5 scale-90"
                        enterTo="opacity-100 translate-y-0 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 scale-100"
                        leaveTo="opacity-0 -translate-y-5 scale-90">
                        <ul className="px-4 pt-1 pb-3 text-sm rounded-b text-pzh-blue-dark bg-pzh-yellow">
                            <li className="pt-2">
                                Het herhaalde wachtwoord komt niet overeen
                            </li>
                        </ul>
                    </Transition>
                </label>

                <div className="flex items-center justify-between mt-5">
                    <button
                        className="text-sm text-gray-700 underline cursor-pointer hover:text-gray-900 pzh-transition-colors"
                        onClick={() => setOpen(false)}
                        id="close-password-forget-popup"
                        data-testid="close-password-forget-popup">
                        Annuleren
                    </button>
                    <button
                        className={`inline-block w-24 py-1 text-white rounded pzh-transition-colors bg-pzh-green hover:bg-pzh-green-dark focus:outline-none focus:ring`}
                        id="wachtwoord-reset-submit"
                        type="submit">
                        {loading ? <LoaderSpinner /> : 'Wijzig'}
                    </button>
                </div>
            </form>

            <div className="flex items-start px-4 py-3 mt-4 bg-pzh-blue-light bg-opacity-20">
                <div className="pt-1 pr-4">
                    <FontAwesomeIcon className="text-md" icon={faInfoCircle} />
                </div>
                <p className="text-sm">
                    Ben je je huidige wachtwoord vergeten? Neem dan contact op
                    met
                    <a
                        ref={mailToAnchor}
                        href="mailto:omgevingsbeleid@pzh.nl?subject=Wachtwoord vergeten"
                        className="ml-1 underline"
                        id="wachtwoord-reset-mail">
                        omgevingsbeleid@pzh.nl
                    </a>
                </p>
            </div>
        </PopUpAnimatedContainer>
    )
}
