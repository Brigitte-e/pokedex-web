import "@testing-library/jest-dom";

// jsdom does not implement scrollIntoView, used by listbox keyboard navigation.
window.HTMLElement.prototype.scrollIntoView = jest.fn();
