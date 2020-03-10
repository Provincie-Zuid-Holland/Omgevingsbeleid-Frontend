const VOLGENDE_STATUS = {
    'Ontwerp GS Concept': ['Ontwerp GS'],
    'Ontwerp GS': ['Ontwerp PS', 'Ontwerp in inspraak'],
    'Ontwerp PS': ['Ontwerp in inspraak', 'Ontwerp GS Concept'],
    'Ontwerp in inspraak': ['Definitief ontwerp GS concept'],
    'Definitief ontwerp GS concept': ['Definitief ontwerp GS'],
    'Definitief ontwerp GS': [
        'Definitief ontwerp PS',
        'Ontwerp GS Concept',
        'Vastgesteld',
    ],
    'Definitief ontwerp PS': ['Vastgesteld', 'Ontwerp GS Concept'],
    Vastgesteld: ['Vigerend'],
    Vigerend: ['Vigerend gearchiveerd'],
    'Vigerend Gearchiveerd': [],
    Gepubliceerd: [],
}

export default VOLGENDE_STATUS
