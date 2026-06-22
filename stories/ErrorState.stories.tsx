import type { Meta, StoryObj } from "@storybook/nextjs";
import { ErrorState } from "../components/ErrorState";

const meta: Meta<typeof ErrorState> = {
  title: "Components/ErrorState",
  component: ErrorState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {};

export const CustomMessage: Story = {
  args: { message: "Character not found" },
};

export const NetworkError: Story = {
  args: { message: "Failed to fetch characters" },
};
