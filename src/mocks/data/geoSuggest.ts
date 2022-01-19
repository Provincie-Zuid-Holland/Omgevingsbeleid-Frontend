const geoSuggest = {
    response: {
        numFound: 323883,
        start: 0,
        maxScore: 19.612804,
        docs: [
            {
                type: 'gemeente',
                weergavenaam: "Gemeente 's-Gravenhage",
                id: 'gem-339aeade1bbb0005ba845b14d29d2c15',
                score: 19.612804,
            },
            {
                type: 'weg',
                weergavenaam: 'Haag, Deurne',
                id: 'weg-b7b877df87cb7af91e8819c48f55df25',
                score: 18.46795,
            },
            {
                type: 'weg',
                weergavenaam: 'De Haag, Brakel',
                id: 'weg-178cc62090ca09626a651ab231733a29',
                score: 17.468987,
            },
            {
                type: 'weg',
                weergavenaam: 'De Haag, Geleen',
                id: 'weg-ee80dc1d9eac7c7beaaeeb261becdec2',
                score: 17.468987,
            },
            {
                type: 'weg',
                weergavenaam: 'De Haag, Gemert',
                id: 'weg-36f67c3bb00858d8be0cf8130262dcf1',
                score: 17.468987,
            },
            {
                type: 'weg',
                weergavenaam: 'De Haag, Houten',
                id: 'weg-15ca430dd38076e4f02cb313acdc7ad9',
                score: 17.468987,
            },
            {
                type: 'weg',
                weergavenaam: 'De Haag, Veghel',
                id: 'weg-fc10de5ae5f4716f42da666d3115c565',
                score: 17.468987,
            },
            {
                type: 'woonplaats',
                weergavenaam: "'s-Gravenhage, 's-Gravenhage, Zuid-Holland",
                id: 'wpl-3597581be599a52df395ce19248ab9f5',
                score: 17.087297,
            },
            {
                type: 'weg',
                weergavenaam: 'In de Haag, Meijel',
                id: 'weg-295870ec068a256aca9040a318320b00',
                score: 16.625746,
            },
            {
                type: 'weg',
                weergavenaam: 'Dijkstraat, Hoef en Haag',
                id: 'weg-272354014988f88c59e47fb250ed8b23',
                score: 16.454706,
            },
        ],
    },
    highlighting: {
        'gem-339aeade1bbb0005ba845b14d29d2c15': {
            suggest: ['Gemeente &#x27;s-<b>Gravenhage</b>'],
        },
        'weg-b7b877df87cb7af91e8819c48f55df25': {
            suggest: ['<b>Haag</b>, <b>Deurne</b>'],
        },
        'weg-178cc62090ca09626a651ab231733a29': {
            suggest: ['<b>De</b> <b>Haag</b>, Brakel'],
        },
        'weg-ee80dc1d9eac7c7beaaeeb261becdec2': {
            suggest: ['<b>De</b> <b>Haag</b>, Geleen'],
        },
        'weg-36f67c3bb00858d8be0cf8130262dcf1': {
            suggest: ['<b>De</b> <b>Haag</b>, Gemert'],
        },
        'weg-15ca430dd38076e4f02cb313acdc7ad9': {
            suggest: ['<b>De</b> <b>Haag</b>, Houten'],
        },
        'weg-fc10de5ae5f4716f42da666d3115c565': {
            suggest: ['<b>De</b> <b>Haag</b>, Veghel'],
        },
        'wpl-3597581be599a52df395ce19248ab9f5': {
            suggest: [
                '&#x27;s-<b>Gravenhage</b>, &#x27;s-<b>Gravenhage</b>, Zuid-Holland',
            ],
        },
        'weg-295870ec068a256aca9040a318320b00': {
            suggest: ['In <b>de</b> <b>Haag</b>, Meijel'],
        },
        'weg-272354014988f88c59e47fb250ed8b23': {
            suggest: ['<b>Dijkstraat</b>, Hoef en <b>Haag</b>'],
        },
    },
    spellcheck: {
        suggestions: [],
        collations: [],
    },
}

export { geoSuggest }
