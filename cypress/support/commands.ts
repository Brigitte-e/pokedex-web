// Custom Cypress commands — add application-specific commands here.

/** Mirrors `FavoriteItem` from `types/favorite.ts` (cypress tsconfig can't import app files). */
interface FavoriteItem {
  id: string;
  name: string;
  image?: string;
  type?: string;
  source?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Visit a page as a signed-in user (from the `user` fixture). Seeds the
       * e2e seams read by AuthProvider and the favorites service before the
       * app loads.
       */
      visitAsUser(url: string, favorites?: FavoriteItem[]): Chainable<Cypress.AUTWindow>;
    }
  }
}

Cypress.Commands.add("visitAsUser", (url: string, favorites: FavoriteItem[] = []) => {
  return cy.fixture("user").then((user) =>
    cy.visit(url, {
      onBeforeLoad(win) {
        const w = win as Cypress.AUTWindow & {
          __E2E_USER__?: unknown;
          __E2E_FAVORITES__?: FavoriteItem[];
        };
        w.__E2E_USER__ = user;
        w.__E2E_FAVORITES__ = favorites;
      },
    }),
  );
});

export {};
