import { Divider, Text } from '@pzh-ui/components'
import { AngleDown, AngleRight, User } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '@/hooks/useAuth'

import { DropdownContainer } from '../Dropdown'

const UserMenu = () => {
    const { user, signout } = useAuth()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                className="flex items-center text-pzh-white ml-2"
                onClick={() => setIsOpen(!isOpen)}
                data-testid="user-menu">
                <span className="sr-only">Gebruikersmenu</span>
                <User size={20} />
                <AngleDown
                    className={classNames(
                        'ml-0.5 transition duration-150 ease-in-out',
                        {
                            'transform rotate-180': isOpen,
                        }
                    )}
                />
            </button>
            {isOpen && (
                <>
                    <div className="fixed top-0 left-0 z-0 block w-screen h-screen bg-gray-900/40" />
                    <DropdownContainer
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        className="mt-8">
                        <div className="py-2 px-4">
                            <strong className="font-bold">
                                {user?.Gebruikersnaam}
                            </strong>
                            <Text type="body-small" className="block">
                                {user?.Rol}
                            </Text>
                        </div>
                        <Divider className="mt-0" />
                        <div className="py-2 px-4">
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
    )
}

export default UserMenu
