const VOLGENDE_STATUS = {
    null: ['Ontwerp GS Concept'] as const,
    Ontwerp: ['Ontwerp GS Concept'] as const,
    'Ontwerp GS Concept': ['Ontwerp GS'] as const,
    'Ontwerp GS': ['Ontwerp PS', 'Ontwerp in inspraak'] as const,
    'Ontwerp PS': ['Ontwerp in inspraak', 'Ontwerp GS Concept'] as const,
    'Ontwerp in inspraak': ['Definitief ontwerp GS concept'] as const,
    'Definitief ontwerp GS concept': ['Definitief ontwerp GS'] as const,
    'Definitief ontwerp GS': [
        'Definitief ontwerp PS',
        'Ontwerp GS Concept',
        'Vastgesteld',
    ] as const,
    'Definitief ontwerp PS': ['Vastgesteld', 'Ontwerp GS Concept'] as const,
    Vastgesteld: ['Vigerend'] as const,
    Vigerend: ['Vigerend gearchiveerd', 'Uitgecheckt'] as const,
    'Vigerend gearchiveerd': [] as const,
    'Niet-Actief': [] as const,
    Uitgecheckt: [] as const,
}

export default VOLGENDE_STATUS
