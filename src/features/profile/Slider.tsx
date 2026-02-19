import {
  SLIDER_POSITION_CLASSES,
  SLIDER_WIDTH_CLASSES,
} from "@/constants/slider";

interface SilderProps {
  level: number;
}

export default function HelperSlider({ level }: SilderProps) {
  const max = 4;
  const currentIndex = Math.max(0, Math.min(level - 1, max));

  return (
    <div className="w-75.75 my-4">
      <div className="relative h-4 w-full">
        <div className="absolute inset-0 h-4 w-full bg-gray-200 rounded-full border border-gray-200" />
        <div
          className={`absolute inset-y-0 left-0 h-4 bg-black rounded-full ${SLIDER_WIDTH_CLASSES[currentIndex]}`}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full ${SLIDER_POSITION_CLASSES[i]} ${i === 0 ? "ml-2" : i === max ? "-ml-2" : ""}`}
          />
        ))}
        <div
          className={`absolute top-1/2 -translate-y-1/2 z-20 ${SLIDER_POSITION_CLASSES[currentIndex]}`}
        >
          <div className="w-7 h-7 bg-white border-[1.5px] border-black rounded-full shadow -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
