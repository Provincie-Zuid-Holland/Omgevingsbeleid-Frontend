interface ToggleSwitchProps {
    title: string
    checked?: boolean
    onClick: (checked: boolean) => void
}

const ToggleSwitch = ({ title, checked, onClick }: ToggleSwitchProps) => (
    <label className="relative inline-block h-8 w-[54px]">
        <input
            type="checkbox"
            checked={checked}
            // @ts-ignore
            onClick={event => onClick(event.target.checked)}
            readOnly
            className="peer h-0 w-0 opacity-0"
            data-testid="toggle-switch"
        />
        <span className="sr-only">{title}</span>
        <span className="absolute top-0 right-0 bottom-0 left-0 cursor-pointer rounded-[34px] bg-pzh-gray-300 transition peer-checked:bg-pzh-green-500 peer-focus:ring peer-focus:ring-pzh-blue-900 peer-focus:ring-offset-2 before:absolute before:bottom-1 before:left-1 before:h-6 before:w-6 before:rounded-full before:bg-pzh-white before:transition before:content-[''] peer-checked:before:translate-x-[22px]" />
    </label>
)

export default ToggleSwitch
