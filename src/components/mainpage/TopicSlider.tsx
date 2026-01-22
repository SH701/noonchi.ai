"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { TopicProps } from "@/types/topics";

export default function TopicSlider({ topics, active, onSelect }: TopicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const trackWidth = trackRef.current.scrollWidth;

    const maxDrag = containerWidth - trackWidth;

    setConstraints({
      left: maxDrag < 0 ? maxDrag : 0,
      right: 0,
    });
  }, [topics]);

  return (
    <div ref={containerRef} className="overflow-hidden w-full pb-6">
      <motion.div
        ref={trackRef}
        className="flex cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={constraints}
        transition={{ type: "spring", bounce: 0.2 }}
      >
        {topics.map((t) => (
          <div key={t.label} className="shrink-0 mr-1">
            <Button
              variant={active === t.label ? "primary" : "ghost"}
              size="sm"
              onClick={() => onSelect(t.label)}
            >
              {t.label}
            </Button>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
