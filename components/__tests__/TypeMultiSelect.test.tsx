import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TypeMultiSelect, type TypeMultiSelectLabels } from "../TypeMultiSelect";

const labels: TypeMultiSelectLabels = {
  filterByType: "Filter by type",
  typesSelectedPattern: "{count} types selected",
  clearAll: "Clear all",
  searchPlaceholder: "Search types…",
  noTypesFound: "No types found",
  scrollForMore: "Scroll for more…",
  removeTypePattern: "Remove {name}",
  clearSearch: "Clear search",
};

const types = [
  { name: "fire" },
  { name: "water" },
  { name: "grass" },
  { name: "electric" },
];

function renderSelect(selected: string[] = [], onChange = jest.fn()) {
  render(<TypeMultiSelect types={types} selected={selected} onChange={onChange} labels={labels} />);
  return onChange;
}

describe("TypeMultiSelect", () => {
  it("shows the placeholder when nothing is selected", () => {
    renderSelect();
    expect(screen.getByRole("combobox")).toHaveTextContent("Filter by type");
  });

  it("shows a badge for each selected type", () => {
    renderSelect(["fire", "water"]);
    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveTextContent("fire");
    expect(combobox).toHaveTextContent("water");
  });

  it("opens the listbox and lists the types", async () => {
    renderSelect();
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(types.length);
  });

  it("adds a type on option click", async () => {
    const onChange = renderSelect(["fire"]);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: /Water/ }));
    expect(onChange).toHaveBeenCalledWith(["fire", "water"]);
  });

  it("removes an already selected type on option click", async () => {
    const onChange = renderSelect(["fire", "water"]);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: /Fire/ }));
    expect(onChange).toHaveBeenCalledWith(["water"]);
  });

  it("filters options via the search input", async () => {
    renderSelect();
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.type(screen.getByRole("textbox", { name: "Search types…" }), "gra");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: /Grass/ })).toBeInTheDocument();
  });

  it("shows an empty message when nothing matches the search", async () => {
    renderSelect();
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.type(screen.getByRole("textbox", { name: "Search types…" }), "zzz");
    expect(screen.getByText("No types found")).toBeInTheDocument();
  });

  it("removes a selected type via its badge", async () => {
    const onChange = renderSelect(["fire", "water"]);
    await userEvent.click(screen.getByRole("button", { name: "Remove fire" }));
    expect(onChange).toHaveBeenCalledWith(["water"]);
  });

  it("clears the whole selection", async () => {
    const onChange = renderSelect(["fire", "water"]);
    await userEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("clears the search via the clear-search button", async () => {
    renderSelect();
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.type(screen.getByRole("textbox", { name: "Search types…" }), "gra");
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getAllByRole("option")).toHaveLength(types.length);
  });

  it("opens and closes with Enter on the trigger", async () => {
    renderSelect();
    const combobox = screen.getByRole("combobox");
    combobox.focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    combobox.focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes with Escape on the trigger", async () => {
    renderSelect();
    const combobox = screen.getByRole("combobox");
    await userEvent.click(combobox);
    combobox.focus();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("toggles an option with keyboard navigation in the list", async () => {
    const onChange = renderSelect();
    await userEvent.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");
    listbox.focus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowUp}{Enter}");
    expect(onChange).toHaveBeenCalledWith(["fire"]);
  });

  it("closes the list with Escape from the list", async () => {
    renderSelect();
    await userEvent.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");
    listbox.focus();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes when clicking outside", async () => {
    renderSelect();
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.click(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows the single selected type name in the trigger", () => {
    renderSelect(["fire"]);
    expect(screen.getByRole("combobox")).toHaveTextContent("fire");
  });

  it("loads more options when scrolling to the bottom", async () => {
    const manyTypes = Array.from({ length: 15 }, (_, i) => ({ name: `type-${i}` }));
    render(
      <TypeMultiSelect types={manyTypes} selected={[]} onChange={jest.fn()} labels={labels} />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByText("Scroll for more…")).toBeInTheDocument();
    const initialCount = screen.getAllByRole("option").length;
    expect(initialCount).toBeLessThan(manyTypes.length);

    const listbox = screen.getByRole("listbox");
    // JSDOM has no layout, so fake the scroll geometry to hit the load-more branch.
    Object.defineProperty(listbox, "scrollTop", { value: 1000, configurable: true });
    Object.defineProperty(listbox, "clientHeight", { value: 224, configurable: true });
    Object.defineProperty(listbox, "scrollHeight", { value: 300, configurable: true });
    fireEvent.scroll(listbox);
    expect(screen.getAllByRole("option")).toHaveLength(manyTypes.length);
    expect(screen.queryByText("Scroll for more…")).not.toBeInTheDocument();
  });
});
