import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GenerationSelect, type GenerationSelectLabels } from "../GenerationSelect";

const labels: GenerationSelectLabels = {
  filterByGeneration: "Filter by generation",
  allGenerations: "All generations",
  generationPattern: "Generation {suffix}",
  generationPrefix: "generation-",
};

const generations = [{ name: "generation-i" }, { name: "generation-ii" }];

describe("GenerationSelect", () => {
  it("shows the placeholder when nothing is selected", () => {
    render(
      <GenerationSelect generations={generations} selected={null} onChange={jest.fn()} labels={labels} />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Filter by generation");
  });

  it("shows the formatted label of the selected generation", () => {
    render(
      <GenerationSelect
        generations={generations}
        selected="generation-ii"
        onChange={jest.fn()}
        labels={labels}
      />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Generation II");
  });

  it("opens the listbox with all options on click", async () => {
    render(
      <GenerationSelect generations={generations} selected={null} onChange={jest.fn()} labels={labels} />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByText("All generations")).toBeInTheDocument();
  });

  it("selects a generation and closes the list", async () => {
    const onChange = jest.fn();
    render(
      <GenerationSelect generations={generations} selected={null} onChange={onChange} labels={labels} />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByText("Generation I"));
    expect(onChange).toHaveBeenCalledWith("generation-i");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("clears the filter via the all-generations option", async () => {
    const onChange = jest.fn();
    render(
      <GenerationSelect
        generations={generations}
        selected="generation-i"
        onChange={onChange}
        labels={labels}
      />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByText("All generations"));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("supports keyboard selection with arrow keys and Enter", async () => {
    const onChange = jest.fn();
    render(
      <GenerationSelect generations={generations} selected={null} onChange={onChange} labels={labels} />,
    );
    const combobox = screen.getByRole("combobox");
    combobox.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    const listbox = screen.getByRole("listbox");
    listbox.focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("generation-i");
  });

  it("closes on Escape without selecting", async () => {
    const onChange = jest.fn();
    render(
      <GenerationSelect generations={generations} selected={null} onChange={onChange} labels={labels} />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("opens and closes with Enter on the trigger", async () => {
    render(
      <GenerationSelect generations={generations} selected={null} onChange={jest.fn()} labels={labels} />,
    );
    const combobox = screen.getByRole("combobox");
    combobox.focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    combobox.focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("clamps ArrowUp at the first option and Escape closes the list", async () => {
    render(
      <GenerationSelect generations={generations} selected={null} onChange={jest.fn()} labels={labels} />,
    );
    const combobox = screen.getByRole("combobox");
    combobox.focus();
    await userEvent.keyboard("{ArrowDown}");
    const listbox = screen.getByRole("listbox");
    listbox.focus();
    await userEvent.keyboard("{ArrowUp}{ArrowUp}{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes when clicking outside", async () => {
    render(
      <GenerationSelect generations={generations} selected={null} onChange={jest.fn()} labels={labels} />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.click(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
