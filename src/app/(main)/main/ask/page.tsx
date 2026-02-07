"use client";

import { useState } from "react";
import { ChatroomInput } from "@/components/chatroom";

export default function Ask() {
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendText = (content: string) => {
    console.log("Send:", content);
    setMessage("");
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="pt-6">
        <h1 className="text-xl font-medium text-gray-800">Who is this for?</h1>
        <span className="text-gray-600">
          This can be something you`re <br />
          about to say or do.
        </span>
      </div>
      <div className="mt-auto"></div>
    </div>
  );
}
