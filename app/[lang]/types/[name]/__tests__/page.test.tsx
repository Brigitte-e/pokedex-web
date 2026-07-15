import { render, screen } from "@testing-library/react";
import TypeDetailPage from "../page";
import { fetchType } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("@/lib/api/types", () => ({ fetchType: jest.fn() }));

const mockNotFound = jest.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
jest.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
  useParams: () => ({ lang: "en" }),
}));

const fetchTypeMock = fetchType as jest.Mock;

const fireType = {
  name: "fire",
  names: [{ name: "Feuer", language: { name: "de", url: "" } }],
  damage_relations: {
    double_damage_to: [{ name: "grass", url: "" }],
    double_damage_from: [],
    half_damage_to: [],
    half_damage_from: [],
    no_damage_to: [],
    no_damage_from: [],
  },
  moves: [{ name: "ember", url: "" }],
};

const grassType = { ...fireType, name: "grass", names: [], moves: [] };

function renderPage(lang = "en", name = "fire") {
  return TypeDetailPage({ params: Promise.resolve({ lang, name }) });
}

describe("TypeDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchTypeMock.mockImplementation((name: string) =>
      Promise.resolve(name === "fire" ? fireType : grassType),
    );
  });

  it("renders the type header, damage relations and moves", async () => {
    render(await renderPage());
    expect(screen.getByRole("heading", { level: 1, name: "Fire" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Grass" })).toHaveAttribute("href", "/en/types/grass");
    expect(screen.getByRole("button", { name: "Ember" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back/i })).toHaveAttribute(
      "href",
      "/en/types",
    );
  });

  it("uses the localized type name for the active locale", async () => {
    render(await renderPage("de"));
    expect(screen.getByRole("heading", { level: 1, name: "Feuer" })).toBeInTheDocument();
  });

  it("calls notFound for unknown types", async () => {
    fetchTypeMock.mockRejectedValue(new ApiError(404, "/type/nope"));
    await expect(renderPage("en", "nope")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("rethrows non-404 errors", async () => {
    fetchTypeMock.mockRejectedValue(new ApiError(500, "/type/fire"));
    await expect(renderPage()).rejects.toThrow("PokeAPI error 500");
    expect(mockNotFound).not.toHaveBeenCalled();
  });
});
