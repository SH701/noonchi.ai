import { StarIcon, TalkIcon, UpIcon } from "@/assets/svgr";
import Part from "./Part";

interface FeedbackPartProps {
  summary: string;
  goodPoints: string;
  improvementPoints: { point: string; tip: string }[];
}

export default function FeedbackPart({
  summary,
  goodPoints,
  improvementPoints,
}: FeedbackPartProps) {
  return (
    <div className="space-y-4 pb-2 ">
      <Part title="Conversation Summary" desc={summary} icon={<TalkIcon />} />
      <Part title="What you did well" desc={goodPoints} icon={<UpIcon />} />
      <Part
        title="What you can improve"
        desc={improvementPoints?.[0]?.point}
        icon={<StarIcon />}
        desc2={improvementPoints?.[0]?.tip}
      />
    </div>
  );
}
