import { render, screen } from "@testing-library/react";
import { PageContainer } from "../PageContainer";

describe("PageContainer", () => {
  it("renders children inside a main landmark", () => {
    render(
      <PageContainer>
        <p>content</p>
      </PageContainer>,
    );
    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByText("content"));
  });
});
