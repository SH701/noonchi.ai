import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Textarea from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    value: "",
    onChange: () => {},
    onClick: () => {},
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Enter details...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Description",
    placeholder: "Enter description",
  },
};

export const Required: Story = {
  args: {
    label: "Details",
    placeholder: "Required field",
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Loading",
    value: "Generating...",
    disabled: true,
  },
};
