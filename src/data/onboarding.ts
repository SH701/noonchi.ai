import type { ComponentType } from "react";
import First from "@/components/onboard/first";
import Fifth from "@/components/onboard/fifth";

type Slide = {
  id: number;
  title: string;
  desc: string;
  icon: ComponentType;
  img?: string;
};

export const slides: Slide[] = [
  {
    id: 1,
    title: "Worried about sounding rude in Korean?",
    desc: "Noonchi helps you speak naturally and respectfully without second guessing.",
    icon: First,
  },

  {
    id: 5,
    title: "Ready to start?",
    desc: "Practice honorifics naturally by chatting with K-Etiquette.",
    icon: Fifth,
  },
];
