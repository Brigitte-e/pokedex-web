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
    title: "TV Shows",
    items: ["Gravity Falls", "Gravity Falls: Shorts"],
  },
};

export const Empty: Story = {
  args: {
    title: "Films",
    items: [],
  },
};

export const ManyItems: Story = {
  args: {
    title: "Allies",
    items: ["Dipper Pines", "Mabel Pines", "Grunkle Stan", "Wendy Corduroy", "Soos Ramirez"],
  },
};
