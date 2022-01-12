const scrollToElementByID = id => {
    if (!id || id === '') {
        console.error('No id argument supplied')
        return
    }

    const el = document.getElementById(id)
    const y = el.getBoundingClientRect().top + window.pageYOffset - 100
    window.scrollTo({
        top: y,
        behavior: 'smooth',
    })
}

export { scrollToElementByID }
