import { Divider, Text } from '@pzh-ui/components'
import { AngleDown, AngleRight, User } from '@pzh-ui/icons'
import classNames from 'clsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '@/hooks/useAuth'
import useModalStore from '@/store/modalStore'

import { DropdownContainer } from '../../Dropdown'
import PasswordChangeModal from '../../Modals/PasswordChangeModal'

const UserMenu = () => {
    const { user, signout } = useAuth()
    const navigate = useNavigate()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [isOpen, setIsOpen] = useState(false)

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
                <DropdownContainer
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    className="mt-8"
                    hasBackdrop>
                    <div className="px-4 py-2">
                        <Text bold>{user?.Gebruikersnaam}</Text>
                        <Text size="s" className="block">
                            {user?.Rol}
                        </Text>
                    </div>
                    <Divider className="mt-0" />
                    <div className="px-4 py-2">
                        <button
                            className="flex items-center"
                            onClick={() => {
                                setActiveModal('passwordReset')
                                setIsOpen(false)
                            }}>
                            <AngleRight className="-mt-1 mr-1" />
                            <Text>Wachtwoord wijzigen</Text>
                        </button>
                        <button
                            onClick={() => signout(() => navigate('/'))}
                            className="flex items-center">
                            <AngleRight className="-mt-1 mr-1" />
                            <Text>Uitloggen</Text>
                        </button>
                    </div>
                </DropdownContainer>
            </div>

            <PasswordChangeModal />
        </>
    )
}

export default UserMenu
