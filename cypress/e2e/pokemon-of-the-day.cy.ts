describe("Pokemon of the day", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/en/pokemon-of-the-day");
  });

  it("hides the pokemon until it is revealed", () => {
    cy.contains("???").should("be.visible");
    cy.contains("button", "Reveal today's Pokémon").should("be.enabled");
  });

  it("reveals the daily pokemon and keeps it revealed after reload", () => {
    cy.contains("button", "Reveal today's Pokémon").click();
    cy.contains("???").should("not.exist");
    cy.contains("a", "View details").should("be.visible");

    cy.reload();
    cy.contains("???").should("not.exist");
    cy.contains("a", "View details").should("be.visible");
  });
});
