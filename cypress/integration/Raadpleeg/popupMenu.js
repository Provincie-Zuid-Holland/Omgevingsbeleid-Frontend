describe("Popup Menu", () => {
    it(`User can open an close the menu`, () => {
        cy.visit("/")
        cy.get("#popup-menu-toggle").click()
        cy.get("#popup-menu").should("be.visible")
        cy.get("#popup-menu-toggle").click()
        cy.get("#popup-menu").should("not.exist")
    })

    it(`User can filter items in a sub menu`, () => {
        cy.visit("/")
        cy.get("#popup-menu-toggle").click()

        // Will contain the titles of the object that the current sub menu is displaying
        const menuSubItems = []

        // Populate the array with the different types on the page
        cy.get("#popup-menu-active-nav a").each((el) => {
            const text = el.text()
            cy.log("Add " + text)
            menuSubItems.push(text)
        })

        // Wrap so we can access types
        cy.wrap(menuSubItems).then(() => {
            cy.log(menuSubItems[0])

            cy.get("#popup-menu #filter-query").click().type(menuSubItems[0])
            cy.get("#popup-menu-active-nav a").should("have.length", 1)
            cy.get("#popup-menu #filter-query").clear()
            cy.get("#popup-menu-active-nav a").should(
                "have.length",
                menuSubItems.length
            )
        })
    })

    it(`User can navigate through the popup menu to a detail page`, () => {
        cy.visit("/")

        const menuItems = [
            "Beleidsprestaties",
            "Ambities",
            "Beleidskeuzes",
            "Maatregelen (Programma's)",
            "Beleidsprestaties",
            "Beleidsregels",
        ]
        menuItems.forEach((e) => {
            cy.get("#popup-menu-toggle").click()
            cy.get("#popup-menu").contains(e).click()
            cy.get("#popup-menu-active-nav a").first().click()
            cy.url().should("include", `/detail`)
            cy.get("#raadpleeg-detail-header-one").should("exist")
        })
    })
})
