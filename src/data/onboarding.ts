
import Level from "@/components/onboard/Level";
import Taste from "@/components/onboard/Taste";
import type { ComponentType } from "react";

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
    desc: "Tell us how comfortable you are chatting in Korean!",
    content: Level,
  },
];
