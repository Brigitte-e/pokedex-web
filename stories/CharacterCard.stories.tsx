import type { Meta, StoryObj } from "@storybook/nextjs";
import { CharacterCard } from "../components/CharacterCard";

const meta: Meta<typeof CharacterCard> = {
  title: "Components/CharacterCard",
  component: CharacterCard,
  tags: ["autodocs"],
  parameters: {
    nextjs: { appDirectory: true },
  },
};

export default meta;
type Story = StoryObj<typeof CharacterCard>;

export const WithImage: Story = {
  args: {
    id: 1,
    name: "Dipper Pines",
    imageUrl: "https://static.wikia.nocookie.net/gravityfalls/images/d/da/S1e1_dipper.png",
  },
};

export const WithoutImage: Story = {
  args: {
    id: 2,
    name: "Mabel Pines",
  },
};

export const LongName: Story = {
  args: {
    id: 3,
    name: "Grunkle Stanford Filbrick Pines",
  },
};
