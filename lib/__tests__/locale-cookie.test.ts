import { setLocaleCookie } from "../locale-cookie";
import { LOCALE_COOKIE } from "@/lib/constants";

describe("setLocaleCookie", () => {
  it("stores the locale in the cookie", () => {
    setLocaleCookie("de");
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=de`);
  });

  it("overwrites a previously set locale", () => {
    setLocaleCookie("en");
    setLocaleCookie("es");
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=es`);
    expect(document.cookie).not.toContain(`${LOCALE_COOKIE}=en`);
  });
});
