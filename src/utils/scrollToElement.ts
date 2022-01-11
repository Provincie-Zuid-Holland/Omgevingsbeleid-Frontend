/**
 *
 * @param {string} elSelector - ID of element we need to scroll to
 */
function scrollToElement(elSelector: string) {
    const el = document.getElementById(elSelector)
    if (!el) return

    const yPosition = el.getBoundingClientRect().top + window.scrollY
    window.scroll({
        top: yPosition - 170,
        behavior: "smooth",
    })

    el.focus()
    el.classList.add("transition-regular", "border-red-500")

    setTimeout(
        () => el.classList.remove("transition-regular", "border-red-500"),
        2000
    )
}

export default scrollToElement
