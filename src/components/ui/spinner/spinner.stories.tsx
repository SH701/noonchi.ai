import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Spinner } from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"], // 자동 문서화
  argTypes: {
    size: { control: "text" }, // 크기 입력란
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {},
};
export const Small: Story = {
  args: {
    size: "20px",
  },
};

export const Large: Story = {
  args: {
    size: "64px",
    color: "red",
  },
};
