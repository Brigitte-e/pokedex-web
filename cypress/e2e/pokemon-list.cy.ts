describe("Pokemon list", () => {
  beforeEach(() => {
    cy.visit("/en/pokemon");
  });

  it("renders the first page of pokemon cards", () => {
    cy.contains("h3", "All Pokémon").should("be.visible");
    cy.get('a[href="/en/pokemon/bulbasaur"]').should("contain", "#0001");
    cy.get('a[href^="/en/pokemon/"]').should("have.length.at.least", 24);
  });

  it("paginates forward and back through the URL", () => {
    cy.get('nav[aria-label="Pagination"]').contains("button", "Next").click();
    cy.location("search").should("eq", "?page=2");
    cy.get('a[href="/en/pokemon/bulbasaur"]').should("not.exist");

    cy.get('nav[aria-label="Pagination"]').contains("button", "Previous").click();
    cy.location("search").should("eq", "");
    cy.get('a[href="/en/pokemon/bulbasaur"]').should("exist");
  });

  it("loads the requested page from the URL", () => {
    cy.visit("/en/pokemon?page=3");
    cy.get('nav[aria-label="Pagination"]').should("contain", "3");
    cy.get('a[href="/en/pokemon/bulbasaur"]').should("not.exist");
  });

  it("filters pokemon by type", () => {
    cy.contains('[role="combobox"]', "Filter by type").click();
    cy.get('[role="option"]').contains("Fire").click();
    cy.contains("h3", "Pokémon with this type").should("be.visible");
    cy.get('a[href="/en/pokemon/charmander"]').should("exist");
    cy.get('a[href="/en/pokemon/bulbasaur"]').should("not.exist");
  });

  it("navigates to a pokemon detail page from a card", () => {
    cy.get('a[href="/en/pokemon/bulbasaur"]').click();
    cy.location("pathname").should("eq", "/en/pokemon/bulbasaur");
    cy.get("h1").should("contain", "Bulbasaur");
  });
});
