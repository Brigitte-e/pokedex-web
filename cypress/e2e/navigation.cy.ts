describe("Navigation", () => {
  beforeEach(() => {
    cy.visit("/en/pokemon");
  });

  it("redirects the root to the localized pokedex", () => {
    cy.visit("/");
    cy.location("pathname").should("match", /^\/(en|es|de)\/pokemon$/);
  });

  it("shows the main navigation with all sections", () => {
    cy.get('nav[aria-label="Main navigation"]').within(() => {
      cy.contains("a", "Pokémon").should("have.attr", "href", "/en/pokemon");
      cy.contains("a", "Types").should("have.attr", "href", "/en/types");
      cy.contains("a", "Moves").should("have.attr", "href", "/en/moves");
      cy.contains("a", "Items").should("have.attr", "href", "/en/items");
    });
  });

  it("navigates between sections", () => {
    cy.get('nav[aria-label="Main navigation"]').contains("a", "Types").click();
    cy.location("pathname").should("eq", "/en/types");
    cy.get("h1").should("contain", "Types");
  });

  it("sends guests to login when opening favorites", () => {
    cy.get('nav[aria-label="Main navigation"]').contains("a", "Favorites").click();
    cy.location("pathname").should("eq", "/en/login");
  });

  it("switches the language and keeps the current page", () => {
    cy.get('button[aria-label="Select language"]').click();
    cy.get('ul[aria-label="Language"]').contains("button", "DE").click();
    cy.location("pathname").should("eq", "/de/pokemon");
    cy.getCookie("NEXT_LOCALE").should("have.property", "value", "de");
  });
});
