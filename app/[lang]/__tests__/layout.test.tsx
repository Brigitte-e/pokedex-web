import LangLayout, { generateStaticParams, generateMetadata } from "../layout";
import { LOCALES } from "@/lib/constants";

jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("@/providers/AuthProvider", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("@/providers/QueryProvider", () => ({
  QueryProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockNotFound = jest.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
jest.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
  usePathname: () => "/en/pokemon",
}));

describe("lang layout", () => {
  beforeEach(() => jest.clearAllMocks());

  it("generates static params for every locale", () => {
    expect(generateStaticParams()).toEqual(LOCALES.map((lang) => ({ lang })));
  });

  it("generates localized metadata", async () => {
    const metadata = await generateMetadata({
      children: null,
      params: Promise.resolve({ lang: "en" }),
    });
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
  });

  it("falls back to the default title for unknown locales", async () => {
    const metadata = await generateMetadata({
      children: null,
      params: Promise.resolve({ lang: "xx" }),
    });
    expect(metadata).toEqual({ title: "PokéDex" });
  });

  it("returns an html tree with the locale set", async () => {
    const tree = await LangLayout({
      children: <div>content</div>,
      params: Promise.resolve({ lang: "de" }),
    });
    expect(tree.type).toBe("html");
    expect(tree.props.lang).toBe("de");
  });

  it("calls notFound for unsupported locales", async () => {
    await expect(
      LangLayout({ children: null, params: Promise.resolve({ lang: "xx" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });
});
