describe("Login page", () => {
  beforeEach(() => {
    cy.visit("/en/login");
  });

  it("renders the sign-in form", () => {
    cy.contains("Sign in to your account").should("be.visible");
    cy.get("#email").should("be.visible");
    cy.get("#password").should("have.attr", "type", "password");
    cy.contains("button", "Sign in").should("be.enabled");
    cy.contains("button", "Continue with Google").should("be.visible");
  });

  it("shows validation errors when submitting an empty form", () => {
    cy.contains("button", "Sign in").click();
    cy.contains("Enter a valid email address").should("be.visible");
    cy.contains("Password is required").should("be.visible");
  });

  it("toggles password visibility", () => {
    cy.get("#password").type("secret");
    cy.get('button[aria-label="Show password"]').click();
    cy.get("#password").should("have.attr", "type", "text");
    cy.get('button[aria-label="Hide password"]').click();
    cy.get("#password").should("have.attr", "type", "password");
  });

  it("switches between sign in and sign up", () => {
    cy.contains("button", "Sign up").click();
    cy.contains("Create an account").should("be.visible");
    cy.get("#confirmPassword").should("exist");

    cy.contains("button", "Sign in").click();
    cy.contains("Sign in to your account").should("be.visible");
    cy.get("#confirmPassword").should("not.exist");
  });

  it("validates the sign-up form", () => {
    cy.contains("button", "Sign up").click();

    cy.get("#email").type("ash@example.com");
    cy.get("#password").type("abc");
    cy.get("#confirmPassword").type("abc");
    cy.contains("button", "Sign up").click();
    cy.contains("Password must be at least 6 characters").should("be.visible");

    cy.get("#password").clear().type("Abc123");
    cy.get("#confirmPassword").clear().type("Abc124");
    cy.contains("button", "Sign up").click();
    cy.contains("Passwords do not match").should("be.visible");
  });

  it("shows an error message for invalid credentials", () => {
    cy.intercept("POST", "**/accounts:signInWithPassword*", {
      statusCode: 400,
      fixture: "auth/invalid-credentials.json",
    }).as("signIn");

    cy.get("#email").type("ash@example.com");
    cy.get("#password").type("wrong-password");
    cy.contains("button", "Sign in").click();

    cy.wait("@signIn");
    cy.get('[role="alert"]').should("contain", "Incorrect email or password.");
  });

  it("sends a password reset email", () => {
    cy.intercept("POST", "**/accounts:sendOobCode*", { statusCode: 200, body: {} }).as("reset");

    cy.contains("button", "Forgot password?").click();
    cy.contains("Reset your password").should("be.visible");
    cy.get("#email").type("ash@example.com");
    cy.contains("button", "Send reset link").click();

    cy.wait("@reset");
    cy.get('[role="status"]').should("contain", "Check your email for a password reset link.");
  });

  it("returns to sign in from forgot password", () => {
    cy.contains("button", "Forgot password?").click();
    cy.contains("button", "Back to sign in").click();
    cy.contains("Sign in to your account").should("be.visible");
  });
});
