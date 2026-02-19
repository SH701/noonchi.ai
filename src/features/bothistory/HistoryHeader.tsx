import { ChevronLeft, SquarePen } from "lucide-react";
import { Header } from "../../components/common";

export default function HistoryHeader() {
  return (
    <Header
      leftIcon={<ChevronLeft />}
      center="Role Play"
      rightIcon={<SquarePen />}
    />
  );
}
