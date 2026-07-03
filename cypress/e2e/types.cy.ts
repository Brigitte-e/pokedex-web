describe("Types", () => {
  beforeEach(() => {
    cy.visit("/en/types");
  });

  it("renders the grid of type links", () => {
    cy.get("h1").should("contain", "Types");
    cy.get('a[href^="/en/types/"]').should("have.length.at.least", 18);
    cy.get('a[href="/en/types/fire"]').should("be.visible");
  });

  it("opens a type detail page with damage relations", () => {
    cy.get('a[href="/en/types/fire"]').click();
    cy.location("pathname").should("eq", "/en/types/fire");
    cy.contains("Damage Relations").should("be.visible");
    cy.contains("Strong against (2×)").should("be.visible");
  });

  it("navigates back to the types overview", () => {
    cy.visit("/en/types/fire");
    cy.contains("a", "Back to Types").click();
    cy.location("pathname").should("eq", "/en/types");
  });
});
