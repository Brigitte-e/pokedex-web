import { render, screen } from "@testing-library/react";
import TypesPage from "../page";
import { fetchTypeList, fetchType } from "@/lib/api/types";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("@/lib/api/types", () => ({ fetchTypeList: jest.fn(), fetchType: jest.fn() }));

const fetchTypeListMock = fetchTypeList as jest.Mock;
const fetchTypeMock = fetchType as jest.Mock;

describe("TypesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchTypeListMock.mockResolvedValue({
      results: [
        { name: "fire", url: "" },
        { name: "unknown", url: "" },
        { name: "stellar", url: "" },
      ],
    });
    fetchTypeMock.mockImplementation((name: string) =>
      Promise.resolve({ name, names: [], damage_relations: {}, moves: [] }),
    );
  });

  it("renders the header and a tile per standard type", async () => {
    render(await TypesPage({ params: Promise.resolve({ lang: "en" }) }));
    expect(screen.getByRole("heading", { name: "Types" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Fire" })).toHaveAttribute("href", "/en/types/fire");
    expect(fetchTypeMock).toHaveBeenCalledTimes(1);
    expect(fetchTypeMock).not.toHaveBeenCalledWith("unknown");
  });
});
