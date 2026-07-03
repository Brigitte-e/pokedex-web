describe("Items", () => {
  beforeEach(() => {
    cy.visit("/en/items");
  });

  it("renders the item list", () => {
    cy.get("h1").should("contain", "Items");
    cy.get("ul li button").should("have.length.at.least", 20);
  });

  it("opens and closes the item detail modal", () => {
    cy.get("ul li button").first().click();
    cy.get('[role="dialog"]').within(() => {
      cy.contains("Cost").should("be.visible");
      cy.contains("Category").should("be.visible");
    });
    cy.get("body").type("{esc}");
    cy.get('[role="dialog"]').should("not.exist");
  });

  it("paginates the item list", () => {
    cy.get("ul li button").first().invoke("text").then((firstItem) => {
      cy.get('nav[aria-label="Pagination"]').contains("button", "Next").click();
      cy.location("search").should("eq", "?page=2");
      cy.get("ul li button").first().invoke("text").should("not.eq", firstItem);
    });
  });
});
