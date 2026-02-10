import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FileUpload from "./FileUpload";

const meta: Meta<typeof FileUpload> = {
  title: "UI/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  args: {
    onFilesChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {};
