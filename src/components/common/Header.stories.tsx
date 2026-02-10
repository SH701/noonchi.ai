import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft, X } from "lucide-react";
import Header from "./Header";

const meta: Meta<typeof Header> = {
  title: "Common/Header",
  component: Header,
  tags: ["autodocs"],
  argTypes: {
    center: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    center: "Page Title",
  },
};

export const WithIcons: Story = {
  args: {
    leftIcon: <ArrowLeft size={24} />,
    center: "Chat Room",
    rightIcon: <X size={24} />,
  },
};

export const TitleOnly: Story = {
  args: {
    center: "Noonchi",
  },
};
