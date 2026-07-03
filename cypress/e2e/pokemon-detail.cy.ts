describe("Pokemon detail", () => {
  beforeEach(() => {
    cy.visit("/en/pokemon/pikachu");
  });

  it("shows the hero with name, number and measurements", () => {
    cy.get("h1").should("contain", "Pikachu");
    cy.contains("#0025").should("be.visible");
    cy.contains("Height").should("be.visible");
    cy.contains("Weight").should("be.visible");
    cy.contains("Base XP").should("be.visible");
  });

  it("shows the base stats section", () => {
    cy.contains("Base Stats").should("be.visible");
    cy.contains("HP").should("be.visible");
    cy.contains("Speed").should("be.visible");
  });

  it("links type badges to the type detail page", () => {
    cy.get('a[href="/en/types/electric"]').first().click();
    cy.location("pathname").should("eq", "/en/types/electric");
  });

  it("navigates back to the pokedex", () => {
    cy.contains("a", "Back to Pokédex").click();
    cy.location("pathname").should("eq", "/en/pokemon");
  });
});
