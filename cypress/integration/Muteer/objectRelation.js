import { currentDate, futureDate } from "./../../../src/constants/testValues"

const actions = [
    {
        name: "accept",
        button: "Accepteren",
        toast: "Beleidsrelatie geaccepteerd",
    },
    {
        name: "deny",
        button: "Afwijzen",
        toast: "Beleidsrelatie afgewezen",
    },
]

describe("Dimension Status", () => {
    actions.forEach((action) => {
        it(`User can create and ${action.name} a relationship between two beleidskeuzes`, () => {
            cy.contains("Beleidsrelaties", { timeout: 15000 }).click()
            //
            cy.get(
                '#beleidskeuzes-overview li.beleids-item div[data-testid="title"]',
                {
                    timeout: 15000,
                }
            )
                .eq(1)
                .invoke("text")
                .then((toRelation) => {
                    cy.get(
                        '#beleidskeuzes-overview li.beleids-item div[data-testid="title"]'
                    )
                        .eq(0)
                        .invoke("text")
                        .then((fromRelation) => {
                            cy.get("#beleidskeuzes-overview li.beleids-item")
                                .eq(0)
                                .click()
                            cy.contains("Nieuwe relatie").click()
                            cy.get(
                                "#form-field-beleidsrelatie-naar_beleidskeuze",
                                {
                                    timeout: 15000,
                                }
                            )
                                .click()
                                .type(toRelation + "{enter}")

                            cy.get(
                                "#form-field-beleidsrelatie-omschrijving"
                            ).type("Omschrijving")

                            cy.get(
                                "#form-field-beleidsrelatie-begin_geldigheid"
                            ).type(currentDate)
                            cy.get(
                                "#form-field-beleidsrelatie-eind_geldigheid"
                            ).type(futureDate)

                            cy.contains("Opslaan").click()

                            cy.contains("In afwachting", { timeout: 15000 })
                            cy.contains(toRelation)

                            cy.contains("Terug naar overzicht").click()

                            cy.get("#beleidskeuzes-overview li.beleids-item")
                                .eq(1)
                                .click()
                            cy.contains("Verzoeken").click()

                            cy.contains(fromRelation)
                            cy.contains(action.button).click()
                            cy.contains(action.toast)

                            cy.contains("Terug naar overzicht").click()
                        })
                })
        })
    })
})
