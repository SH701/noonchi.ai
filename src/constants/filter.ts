import { FilterState } from "@/types/conversations";

export const filterMap: Record<Exclude<FilterState, null>, string> = {
  done: "ENDED",
  "in-progress": "ACTIVE",
};
