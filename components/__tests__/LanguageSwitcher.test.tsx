import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { LOCALE_COOKIE } from "@/lib/constants";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/en/pokemon/pikachu",
  useRouter: () => ({ push: mockPush }),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("shows the current locale on the trigger", () => {
    render(<LanguageSwitcher locale="en" />);
    expect(screen.getByRole("button", { name: "Select language" })).toHaveTextContent("EN");
  });

  it("opens the language list on click", async () => {
    render(<LanguageSwitcher locale="en" />);
    await userEvent.click(screen.getByRole("button", { name: "Select language" }));
    expect(screen.getByRole("listbox", { name: "Language" })).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("marks the current locale as selected", async () => {
    render(<LanguageSwitcher locale="de" />);
    await userEvent.click(screen.getByRole("button", { name: "Select language" }));
    const selected = screen
      .getAllByRole("option")
      .find((o) => o.getAttribute("aria-selected") === "true");
    expect(selected).toHaveTextContent("DE");
  });

  it("navigates to the same path in the new locale and sets the cookie", async () => {
    render(<LanguageSwitcher locale="en" />);
    await userEvent.click(screen.getByRole("button", { name: "Select language" }));
    await userEvent.click(screen.getByRole("button", { name: "DE" }));
    expect(mockPush).toHaveBeenCalledWith("/de/pokemon/pikachu");
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=de`);
  });

  it("does not navigate when picking the current locale", async () => {
    render(<LanguageSwitcher locale="en" />);
    await userEvent.click(screen.getByRole("button", { name: "Select language" }));
    await userEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(mockPush).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes the list on Escape", async () => {
    render(<LanguageSwitcher locale="en" />);
    await userEvent.click(screen.getByRole("button", { name: "Select language" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
