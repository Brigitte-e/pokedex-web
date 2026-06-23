import type { Meta, StoryObj } from "@storybook/nextjs";
import { DetailSection } from "../components/DetailSection";

const meta: Meta<typeof DetailSection> = {
  title: "Components/DetailSection",
  component: DetailSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DetailSection>;

export const WithItems: Story = {
  args: {
    title: "Abilities",
    items: ["overgrow", "chlorophyll"],
  },
};

export const Empty: Story = {
  args: {
    title: "Moves",
    items: [],
  },
};

export const ManyItems: Story = {
  args: {
    title: "Moves",
    items: ["tackle", "growl", "vine-whip", "razor-leaf", "solar-beam", "leech-seed"],
  },
};
