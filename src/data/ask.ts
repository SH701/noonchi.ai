import AskChat from "@/features/ask/PreAsk";
import AskInfo from "@/features/ask/AskChat";
import { ComponentType } from "react";

interface slidesProps {
  id: number;
  content: ComponentType;
}

export const slides: slidesProps[] = [
  { id: 1, content: AskChat },
  { id: 2, content: AskInfo },
];
