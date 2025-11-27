import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

interface EmptyStateProps {
  type: "no-history" | "no-results";
}

export default function EmptyState({ type }: EmptyStateProps) {
  if (type === "no-history") {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <Image src="/circle/circle4.png" alt="loading" width={81} height={81} />
        <p className="text-gray-400 text-center mt-10">No chat history.</p>
        <Link
          href="/main/create/roleplay"
          className="flex items-center text-blue-500 hover:underline text-sm"
        >
          Start a conversation with a custom chatbot
          <ChevronRightIcon className="size-4 pt-1" />
        </Link>
      </div>
    );
  }

  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-gray-400">No search results.</p>
      </div>
    );
  }

  return null;
}
