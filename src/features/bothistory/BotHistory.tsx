"use client";

import HistoryHeader from "./HistoryHeader";
import HistorySection from "./HistorySection";
import HistorySort from "./HistorySort";
import RecentTopic from "./RecentTopics";

export default function BotHistory() {
  return (
    <div className="space-y-6">
      <HistoryHeader />
      <RecentTopic />
      <HistorySort />
      <HistorySection />
    </div>
  );
}
