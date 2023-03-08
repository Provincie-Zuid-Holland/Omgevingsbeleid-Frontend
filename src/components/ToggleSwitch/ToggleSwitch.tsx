interface ToggleSwitchProps {
    checked?: boolean
    onClick: (checked: boolean) => void
}

const ToggleSwitch = ({ checked, onClick }: ToggleSwitchProps) => (
    <label className="relative inline-block w-[54px] h-[32px]">
        <input
            type="checkbox"
            checked={checked}
            // @ts-ignore
            onClick={event => onClick(event.target.checked)}
            className="opacity-0 w-0 h-0 peer"
        />
        <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-pzh-gray-300 rounded-[34px] before:absolute before:content-[''] before:h-[24px] before:w-[24px] before:left-[4px] before:bottom-[4px] before:bg-pzh-white before:rounded-full peer-checked:bg-pzh-green peer-checked:before:translate-x-[22px] transition before:transition" />
    </label>
)

export default ToggleSwitch
