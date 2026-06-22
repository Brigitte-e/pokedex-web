import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "../page";

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("Home page", () => {
  it("renders without crashing", () => {
    render(<Home />, { wrapper });
    expect(document.body).toBeTruthy();
  });

  it("renders the page heading", () => {
    render(<Home />, { wrapper });
    expect(screen.getByText("Gravity Falls Characters")).toBeInTheDocument();
  });
});
