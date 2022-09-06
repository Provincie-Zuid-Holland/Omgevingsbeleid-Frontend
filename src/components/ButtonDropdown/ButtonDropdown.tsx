import { EllipsisVertical } from '@pzh-ui/icons'
import { FC } from 'react'

export interface ButtonDropdownProps {
    toggle: () => void
}

const ButtonDropdown: FC<ButtonDropdownProps> = ({ children, toggle }) => {
    return (
        <button
            name="toggle-dropdown"
            type="button"
            data-testid="toggle-dropdown"
            onClick={e => {
                e.stopPropagation()
                e.preventDefault()
                toggle()
            }}
            className="relative p-3 mr-2 rounded-md hover:bg-pzh-gray-100">
            {children}
            <EllipsisVertical />
        </button>
    )
}

export default ButtonDropdown
