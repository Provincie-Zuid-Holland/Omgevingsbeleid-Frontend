function scrollToElement(elSelector) {
    const el = document.getElementById(elSelector)

    if (!el) return

    const yPosition = el.getBoundingClientRect().top + window.scrollY
    console.log(yPosition)
    window.scroll({
        top: yPosition - 170,
        behavior: 'smooth',
    })

    el.focus()

    el.classList.add('transition-regular', 'border-red-500')
    setTimeout(
        () => el.classList.remove('transition-regular', 'border-red-500'),
        2000
    )
}

export default scrollToElement
