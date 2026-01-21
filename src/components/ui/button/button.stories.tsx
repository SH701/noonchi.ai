import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "outline",
        "selected",
        "ghost",
        "destructive",
      ],
    },
    size: {
      control: "select",
      options: ["lg", "md", "sm", "fluid", "icon"],
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "버튼",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "버튼",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "버튼",
  },
};

export const Selected: Story = {
  args: {
    variant: "selected",
    children: "버튼",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "버튼",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "버튼",
  },
};

// 사이즈 variants
export const Large: Story = {
  args: {
    size: "lg",
    children: "Large 버튼",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    children: "Medium 버튼",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small 버튼",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "비활성화",
  },
};
