import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ExitChatting from "./ExitChatting";

const meta: Meta<typeof ExitChatting> = {
  title: "UI/Modal",
  component: ExitChatting,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ExitChatting>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log("Modal closed"),
  },
};
