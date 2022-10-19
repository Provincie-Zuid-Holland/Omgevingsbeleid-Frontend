const useIsWijzigVigerend = () => {
    const params = new URL(document.location as any).searchParams
    const modus = params.get('modus')
    const isWijzigVigerend = modus === 'wijzig_vigerend'

    return isWijzigVigerend
}

export default useIsWijzigVigerend
