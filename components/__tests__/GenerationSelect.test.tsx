import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "../Select";

jest.mock("next/navigation", () => ({
  useParams: () => ({ lang: "en" }),
}));

const generations = [{ name: "generation-i" }, { name: "generation-ii" }];

describe("Select", () => {
  it("shows the placeholder when nothing is selected", () => {
    render(
      <Select generations={generations} selected={null} onChange={jest.fn()} />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Filter by generation");
  });

  it("shows the selected generation name", () => {
    render(
      <Select
        generations={generations}
        selected="generation-ii"
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("generation-ii");
  });

  it("opens the listbox with all options on click", async () => {
    render(
      <Select generations={generations} selected={null} onChange={jest.fn()} />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByText("All generations")).toBeInTheDocument();
  });

  it("selects a generation and closes the list", async () => {
    const onChange = jest.fn();
    render(
      <Select generations={generations} selected={null} onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByText("generation-i"));
    expect(onChange).toHaveBeenCalledWith("generation-i");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("clears the filter via the all-generations option", async () => {
    const onChange = jest.fn();
    render(
      <Select
        generations={generations}
        selected="generation-i"
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByText("All generations"));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("supports keyboard selection with arrow keys and Enter", async () => {
    const onChange = jest.fn();
    render(
      <Select generations={generations} selected={null} onChange={onChange} />,
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
      <Select generations={generations} selected={null} onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("opens and closes with Enter on the trigger", async () => {
    render(
      <Select generations={generations} selected={null} onChange={jest.fn()} />,
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
      <Select generations={generations} selected={null} onChange={jest.fn()} />,
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
      <Select generations={generations} selected={null} onChange={jest.fn()} />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.click(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
