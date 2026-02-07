import { ChevronLeft, SquareIcon } from "lucide-react";
import { Header } from "../common";

export default function RoleplayHistory() {
  return (
    <Header
      leftIcon={<ChevronLeft />}
      center="Role Play"
      rightIcon={<SquareIcon />}
    />
  );
}
