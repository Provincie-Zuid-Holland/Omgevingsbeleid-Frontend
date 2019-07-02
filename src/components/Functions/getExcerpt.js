function getExcerpt(tekst) {
	if (tekst.length > 100) {
		return tekst.substr(0, 100) + '...'
	} else {
		return tekst
	}
}

export default getExcerpt