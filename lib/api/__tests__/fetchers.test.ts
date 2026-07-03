import { get } from "../client";
import { fetchAbilityList, fetchAbility } from "../abilities";
import { fetchItemCategory } from "../categories";
import { fetchGenerationList, fetchGeneration } from "../generations";
import { fetchItemList, fetchItem } from "../items";
import { fetchMoveList, fetchMove } from "../moves";
import { fetchPokemonList, fetchPokemon } from "../pokemon";
import { fetchPokemonSpecies } from "../species";
import { fetchTypeList, fetchType } from "../types";

jest.mock("../client", () => ({ get: jest.fn() }));

const getMock = get as jest.Mock;

describe("API fetchers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getMock.mockResolvedValue({});
  });

  it.each([
    [() => fetchAbilityList(20, 10), "/ability?offset=20&limit=10"],
    [() => fetchAbilityList(), "/ability?offset=0&limit=20"],
    [() => fetchAbility("static"), "/ability/static"],
    [() => fetchItemCategory("standard-balls"), "/item-category/standard-balls"],
    [() => fetchGenerationList(), "/generation"],
    [() => fetchGeneration("generation-i"), "/generation/generation-i"],
    [() => fetchItemList(40, 20), "/item?offset=40&limit=20"],
    [() => fetchItem("poke-ball"), "/item/poke-ball"],
    [() => fetchMoveList(0, 30), "/move?offset=0&limit=30"],
    [() => fetchMove("thunderbolt"), "/move/thunderbolt"],
    [() => fetchPokemonList(24, 24), "/pokemon?offset=24&limit=24"],
    [() => fetchPokemon("pikachu"), "/pokemon/pikachu"],
    [() => fetchPokemon(25), "/pokemon/25"],
    [() => fetchPokemonSpecies(25), "/pokemon-species/25"],
    [() => fetchTypeList(), "/type?limit=100"],
    [() => fetchType("fire"), "/type/fire"],
  ])("requests the expected path (%#: %s)", async (call, path) => {
    await call();
    expect(getMock).toHaveBeenCalledWith(path);
  });
});
