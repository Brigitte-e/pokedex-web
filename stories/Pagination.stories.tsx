import type { Meta, StoryObj } from "@storybook/nextjs";
import { Pagination } from "../components/Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: {
    page: 2,
    totalPages: 5,
    hasPrevious: true,
    hasNext: true,
    onPrevious: () => {},
    onNext: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {};

export const FirstPage: Story = {
  args: { page: 1, hasPrevious: false },
};

export const LastPage: Story = {
  args: { page: 5, hasNext: false },
};

export const SinglePage: Story = {
  args: { page: 1, totalPages: 1, hasPrevious: false, hasNext: false },
};
