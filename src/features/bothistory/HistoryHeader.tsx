
import { Header } from "../../components/common";
import { ChevronLeftIcon, SqurepenIcon } from "@/assets/svgr";

export default function HistoryHeader() {
  return (
    <Header
      leftIcon={<ChevronLeftIcon />}
      center="Role Play"
      rightIcon={<SqurepenIcon />}
    />
  );
}
