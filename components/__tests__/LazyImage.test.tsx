import { render, screen, fireEvent } from "@testing-library/react";
import { LazyImage } from "../LazyImage";

jest.mock("next/image", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const MockImage = React.forwardRef<
    HTMLImageElement,
    React.ImgHTMLAttributes<HTMLImageElement> & { fetchPriority?: string }
  >(function MockImage({ fetchPriority: _fetchPriority, ...props }, ref) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img ref={ref} {...props} />;
  });
  return { __esModule: true, default: MockImage };
});

describe("LazyImage", () => {
  it("renders a pokeball placeholder when src is null", () => {
    render(<LazyImage src={null} alt="pikachu" width={40} height={40} />);
    const placeholder = screen.getByRole("img", { name: "pikachu" });
    expect(placeholder.tagName).toBe("SPAN");
  });

  it("renders the image when src is provided", () => {
    render(<LazyImage src="/sprite.png" alt="pikachu" width={40} height={40} />);
    const img = screen.getByRole("img", { name: "pikachu" });
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "/sprite.png");
  });

  it("shows the skeleton until the image loads", () => {
    const { container } = render(
      <LazyImage src="/sprite.png" alt="pikachu" width={40} height={40} />,
    );
    const skeleton = container.querySelector(".bg-muted");
    expect(skeleton).toHaveClass("opacity-100");

    fireEvent.load(screen.getByRole("img", { name: "pikachu" }));
    expect(skeleton).toHaveClass("opacity-0");
  });

  it("falls back to the placeholder when loading fails", () => {
    render(<LazyImage src="/broken.png" alt="pikachu" width={40} height={40} />);
    fireEvent.error(screen.getByRole("img", { name: "pikachu" }));
    const placeholder = screen.getByRole("img", { name: "pikachu" });
    expect(placeholder.tagName).toBe("SPAN");
  });

  it("marks cached complete images as loaded without waiting for onLoad", () => {
    // JSDOM images are never complete; fake a cached image for the layout effect.
    Object.defineProperty(HTMLImageElement.prototype, "complete", {
      get: () => true,
      configurable: true,
    });
    Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", {
      get: () => 40,
      configurable: true,
    });
    try {
      const { container } = render(
        <LazyImage src="/cached.png" alt="pikachu" width={40} height={40} />,
      );
      expect(container.querySelector(".bg-muted")).toHaveClass("opacity-0");
    } finally {
      delete (HTMLImageElement.prototype as Partial<HTMLImageElement>).complete;
      delete (HTMLImageElement.prototype as Partial<HTMLImageElement>).naturalWidth;
    }
  });

  it("shows the placeholder for cached broken images", () => {
    Object.defineProperty(HTMLImageElement.prototype, "complete", {
      get: () => true,
      configurable: true,
    });
    Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", {
      get: () => 0,
      configurable: true,
    });
    try {
      render(<LazyImage src="/cached-broken.png" alt="pikachu" width={40} height={40} />);
      expect(screen.getByRole("img", { name: "pikachu" }).tagName).toBe("SPAN");
    } finally {
      delete (HTMLImageElement.prototype as Partial<HTMLImageElement>).complete;
      delete (HTMLImageElement.prototype as Partial<HTMLImageElement>).naturalWidth;
    }
  });
});
