import { Divider, Text } from '@pzh-ui/components'
import { AngleDown, AngleRight, User } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '@/hooks/useAuth'

import { DropdownContainer } from '../Dropdown'
import PasswordChangeModal from '../Modals/PasswordChangeModal'

const UserMenu = () => {
    const { user, signout } = useAuth()
    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    return (
        <>
            <div className="relative">
                <button
                    className="ml-2 flex items-center text-pzh-white"
                    onClick={() => setIsOpen(!isOpen)}
                    data-testid="user-menu">
                    <span className="sr-only">Gebruikersmenu</span>
                    <User size={20} />
                    <AngleDown
                        className={classNames(
                            'ml-0.5 transition duration-150 ease-in-out',
                            {
                                'rotate-180 transform': isOpen,
                            }
                        )}
                    />
                </button>
                {isOpen && (
                    <>
                        <div className="fixed left-0 top-0 z-1 block h-screen w-screen bg-gray-900/40" />
                        <DropdownContainer
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            className="mt-8">
                            <div className="px-4 py-2">
                                <strong className="font-bold">
                                    {user?.Gebruikersnaam}
                                </strong>
                                <Text type="body-small" className="block">
                                    {user?.Rol}
                                </Text>
                            </div>
                            <Divider className="mt-0" />
                            <div className="px-4 py-2">
                                <button
                                    className="flex items-center"
                                    onClick={() => {
                                        setOpenModal(true)
                                        setIsOpen(false)
                                    }}>
                                    <AngleRight className="-mt-1 mr-1" />
                                    <Text type="body">Wachtwoord wijzigen</Text>
                                </button>
                                <button
                                    onClick={() => signout(() => navigate('/'))}
                                    className="flex items-center">
                                    <AngleRight className="-mt-1 mr-1" />
                                    <Text type="body">Uitloggen</Text>
                                </button>
                            </div>
                        </DropdownContainer>
                    </>
                )}
            </div>

            <PasswordChangeModal isOpen={openModal} setOpen={setOpenModal} />
        </>
    )
}

export default UserMenu
