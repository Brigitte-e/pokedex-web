describe("Moves", () => {
  beforeEach(() => {
    cy.visit("/en/moves");
  });

  it("renders the move list", () => {
    cy.get("h1").should("contain", "Moves");
    cy.get("ul li button").should("have.length.at.least", 20);
  });

  it("opens the move detail modal with stats", () => {
    cy.get("ul li button").first().click();
    cy.get('[role="dialog"]').within(() => {
      cy.contains("Power").should("be.visible");
      cy.contains("Accuracy").should("be.visible");
      cy.contains("PP").should("be.visible");
    });
  });

  it("closes the modal with Escape", () => {
    cy.get("ul li button").first().click();
    cy.get('[role="dialog"]').should("exist");
    cy.get("body").type("{esc}");
    cy.get('[role="dialog"]').should("not.exist");
  });

  it("paginates the move list", () => {
    cy.get("ul li button").first().invoke("text").then((firstMove) => {
      cy.get('nav[aria-label="Pagination"]').contains("button", "Next").click();
      cy.location("search").should("eq", "?page=2");
      cy.get("ul li button").first().invoke("text").should("not.eq", firstMove);
    });
  });
});
