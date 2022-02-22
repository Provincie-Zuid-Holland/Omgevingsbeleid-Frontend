describe('Search', () => {
    it(`User can search on the map with a click`, () => {
        cy.visit('/')
        cy.get('.leaflet-draw-draw-marker').click() // Click on draw maker
        cy.get('#leaflet-homepage').click() // Click on map
        cy.wait(3000) // Wait for PDOK Api response
        cy.contains('Bekijk provinciaal beleid van deze locatie').click() // Search
        cy.url().should('include', `/zoekresultaten`) // User should see the search results page
    })

    it(`User can search on the map by typing in the searchbar`, () => {
        cy.visit('/')
        cy.get('.leaflet-search').click().type('Waterloostraat den haag')
        cy.get('#searchQueryResults li').first().click()
        cy.wait(3000) // Wait for PDOK Api response
        cy.contains('Bekijk provinciaal beleid van deze locatie').click()
        cy.url().should('include', `/zoekresultaten`) // => true
    })

    it(`User can search in the navigation bar`, () => {
        cy.visit('/')
        cy.get('#search-query').click().type('Water').type('{enter}')
        cy.url().should('include', `/zoekresultaten`) // => true
    })

    it(`User can search in the section on the homepage`, () => {
        cy.visit('/')
        cy.get('#search-query-home').click().type('Water').type('{enter}')
        cy.url().should('include', `/zoekresultaten`) // => true
    })

    it(`User can filter the results`, () => {
        cy.visit('/zoekresultaten?query=water')

        // Will contain the different types of the items from the search
        const types = []

        // Populate the array with the different types on the page
        cy.get('#search-results li [data-test=search-result-type]').each(el => {
            const text = el.text()
            if (types.includes(text)) return
            cy.log('Add ' + text)
            types.push(text)
        })

        // Wrap so we can access types
        cy.wrap(types).then(() => {
            // Click the first filter
            cy.get(`#filter-for-${types[0]}`).click()

            // Check if the rest of the types are filtered out
            cy.get('#search-results li [data-test=search-result-type]').each(
                el => {
                    types
                        .slice(1)
                        .forEach(type => expect(el.text()).not.to.equal(type))
                }
            )
        })
    })

    it(`User can navigate to a detail page on the search results page`, () => {
        cy.visit('/zoekresultaten?query=water')
        cy.get('#search-results li h2').first().click()
        cy.url().should('include', `/detail`)
    })
})
