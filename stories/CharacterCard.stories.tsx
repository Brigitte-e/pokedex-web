import type { Meta, StoryObj } from "@storybook/nextjs";
import { CharacterCard } from "../components/CharacterCard";

const meta: Meta<typeof CharacterCard> = {
  title: "Components/PokemonCard",
  component: CharacterCard,
  tags: ["autodocs"],
  parameters: {
    nextjs: { appDirectory: true },
  },
};

export default meta;
type Story = StoryObj<typeof CharacterCard>;

export const Default: Story = {
  args: {
    id: 25,
    name: "pikachu",
    types: ["electric"],
  },
};

export const DualType: Story = {
  args: {
    id: 6,
    name: "charizard",
    types: ["fire", "flying"],
  },
};

export const LegendaryWithLongName: Story = {
  args: {
    id: 384,
    name: "rayquaza",
    types: ["dragon", "flying"],
  },
};
