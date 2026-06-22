import type { Meta, StoryObj } from "@storybook/nextjs";
import { LoadingState } from "../components/LoadingState";

const meta: Meta<typeof LoadingState> = {
  title: "Components/LoadingState",
  component: LoadingState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LoadingState>;

export const Inline: Story = {
  args: { variant: "inline" },
};

export const Grid: Story = {
  args: { variant: "grid" },
};

export const Detail: Story = {
  args: { variant: "detail" },
};
