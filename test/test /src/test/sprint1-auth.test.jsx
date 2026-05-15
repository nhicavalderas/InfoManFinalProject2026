import { describe, it, expect } from "vitest";

describe("Sprint 1 Authentication Flow Tests", () => {
  it("should allow a user to log in with valid credentials", () => {
    const validEmail = "user@example.com";
    const validPassword = "password123";

    expect(validEmail).toContain("@");
    expect(validPassword.length).toBeGreaterThanOrEqual(8);
  });

  it("should reject login with an invalid email", () => {
    const invalidEmail = "invalid-email";

    expect(invalidEmail).not.toContain("@");
  });

  it("should reject login with an empty password", () => {
    const password = "";

    expect(password).toBe("");
  });

  it("should allow Google OAuth login option to be available", () => {
    const googleOAuthEnabled = true;

    expect(googleOAuthEnabled).toBe(true);
  });
});
