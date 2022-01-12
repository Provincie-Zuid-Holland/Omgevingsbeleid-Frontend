type ButtonProps = {
    text: string
    className?: string
    id?: string | undefined
    onClick?: () => void | undefined
}

function Button({ text, className = '', id, onClick }: ButtonProps) {
    return (
        <button
            className={`px-6 pt-2 pb-1 font-bold text-white transition-colors duration-100 ease-in rounded bg-pzh-blue hover:bg-pzh-blue-dark ${className}`}
            id={id}
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default Button
