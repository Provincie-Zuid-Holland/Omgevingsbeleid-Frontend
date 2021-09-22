const VOLGENDE_STATUS = {
    null: ["Ontwerp GS Concept"],
    Ontwerp: ["Ontwerp GS Concept"],
    "Ontwerp GS Concept": ["Ontwerp GS"],
    "Ontwerp GS": ["Ontwerp PS", "Ontwerp in inspraak"],
    "Ontwerp PS": ["Ontwerp in inspraak", "Ontwerp GS Concept"],
    "Ontwerp in inspraak": ["Definitief ontwerp GS concept"],
    "Definitief ontwerp GS concept": ["Definitief ontwerp GS"],
    "Definitief ontwerp GS": [
        "Definitief ontwerp PS",
        "Ontwerp GS Concept",
        "Vastgesteld",
    ],
    "Definitief ontwerp PS": ["Vastgesteld", "Ontwerp GS Concept"],
    Vastgesteld: ["Vigerend"],
    Vigerend: ["Vigerend gearchiveerd", "Uitgecheckt"],
    "Vigerend Gearchiveerd": [],
}

export default VOLGENDE_STATUS
