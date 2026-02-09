import AskChat from "@/components/ask/AskChat";
import AskInfo from "@/components/ask/AskInfo";
import { ComponentType } from "react";

interface slidesProps {
  id: number;
  content: ComponentType;
}

export const slides: slidesProps[] = [
  { id: 1, content: AskChat },
  { id: 2, content: AskInfo },
];
