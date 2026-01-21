import type { ComponentType } from "react";

import Level from "@/components/onboard/level";
import Taste from "@/components/onboard/taste";

type Slide = {
  id: number;
  title: string;
  desc: string;
  content: ComponentType;
};

export const slides: Slide[] = [
  {
    id: 1,
    title: "Please select your interests",
    desc: "",
    content: Taste,
  },
  {
    id: 2,
    title: "Please select your Korean level",
    desc: "Tell us how comfortable tou are chatting in Korean!",
    content: Level,
  },
];
