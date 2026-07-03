describe("Favorites page", () => {
  let favorites: { id: string; name: string }[];

  beforeEach(() => {
    cy.fixture("favorites").then((data) => {
      favorites = data;
    });
  });

  describe("as a guest", () => {
    it("redirects to the login page", () => {
      cy.visit("/en/favorites");
      cy.location("pathname").should("eq", "/en/login");
      cy.contains("Sign in to your account").should("be.visible");
    });

    it("keeps the locale when redirecting", () => {
      cy.visit("/de/favorites");
      cy.location("pathname").should("eq", "/de/login");
    });
  });

  describe("as a signed-in user", () => {
    it("shows the empty state when there are no favorites", () => {
      cy.visitAsUser("/en/favorites");
      cy.contains("No favorites yet. Star a Pokémon on its detail page.").should("be.visible");
    });

    it("lists the saved pokemon", () => {
      cy.visitAsUser("/en/favorites", favorites);
      cy.contains("2 saved Pokémon").should("be.visible");
      cy.contains("a", "Bulbasaur").should("have.attr", "href", "/en/pokemon/bulbasaur");
      cy.contains("a", "Pikachu").should("have.attr", "href", "/en/pokemon/pikachu");
    });

    it("removes a single favorite after confirmation", () => {
      cy.visitAsUser("/en/favorites", favorites);

      cy.contains("a", "Bulbasaur")
        .closest(".group\\/fav")
        .find('button[aria-label="Remove from favorites"]')
        .click({ force: true });

      cy.contains("Do you really want to remove this pokemon from favorites?").should("be.visible");
      cy.contains("button", "Remove").click();

      cy.contains("1 saved Pokémon").should("be.visible");
      cy.contains("a", "Bulbasaur").should("not.exist");
      cy.contains("a", "Pikachu").should("be.visible");
    });

    it("keeps the favorite when removal is cancelled", () => {
      cy.visitAsUser("/en/favorites", favorites);

      cy.contains("a", "Bulbasaur")
        .closest(".group\\/fav")
        .find('button[aria-label="Remove from favorites"]')
        .click({ force: true });

      cy.contains("button", "Cancel").click();

      cy.contains("2 saved Pokémon").should("be.visible");
      cy.contains("a", "Bulbasaur").should("be.visible");
    });

    it("clears all favorites after confirmation", () => {
      cy.visitAsUser("/en/favorites", favorites);

      cy.contains("button", "Clear all favorites").click();
      cy.contains("Do you really want to remove all pokemon from favorites?").should("be.visible");
      cy.get('[role="dialog"]').contains("button", "Clear all").click();

      cy.contains("No favorites yet. Star a Pokémon on its detail page.").should("be.visible");
    });
  });
});
