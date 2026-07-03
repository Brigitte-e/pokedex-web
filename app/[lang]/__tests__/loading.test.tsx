import { render, screen, cleanup } from "@testing-library/react";
import PokemonLoading from "../pokemon/loading";
import PokemonDetailLoading from "../pokemon/[name]/loading";
import ItemsLoading from "../items/loading";
import MovesLoading from "../moves/loading";
import TypesLoading from "../types/loading";
import TypeDetailLoading from "../types/[name]/loading";
import PokemonOfTheDayLoading from "../pokemon-of-the-day/loading";

const loadingScreens: [string, () => React.ReactElement][] = [
  ["pokemon list", PokemonLoading],
  ["pokemon detail", PokemonDetailLoading],
  ["items", ItemsLoading],
  ["moves", MovesLoading],
  ["types", TypesLoading],
  ["type detail", TypeDetailLoading],
  ["pokemon of the day", PokemonOfTheDayLoading],
];

describe("route loading screens", () => {
  it.each(loadingScreens)("%s renders an accessible loading status", (_name, Loading) => {
    const { container } = render(<Loading />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    cleanup();
  });
});
