import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PreviewModal from "./PreviewModal";

const meta: Meta<typeof PreviewModal> = {
  title: "UI/PreviewModal",
  component: PreviewModal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PreviewModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
};
