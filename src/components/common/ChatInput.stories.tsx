import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ChatInput from "./ChatInput";

const meta: Meta<typeof ChatInput> = {
  title: "Common/ChatInput",
  component: ChatInput,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    showSituation: { control: "boolean" },
    showHint: { control: "boolean" },
    isHintActive: { control: "boolean" },
    isSituationActive: { control: "boolean" },
  },
  args: {
    message: "",
    setMessage: () => {},
    onSend: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {};

export const WithMessage: Story = {
  args: {
    message: "안녕하세요!",
  },
};

export const WithMic: Story = {
  args: {
    onMicClick: () => {},
  },
};

export const WithAllOptions: Story = {
  args: {
    message: "Hello",
    onMicClick: () => {},
    showSituation: true,
    showHint: true,
  },
};

export const ActiveToggles: Story = {
  args: {
    onMicClick: () => {},
    showSituation: true,
    showHint: true,
    isHintActive: true,
    isSituationActive: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Waiting for AI response...",
  },
};
