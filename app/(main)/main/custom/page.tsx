/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/lib/UserContext";

import type { Persona } from "@/lib/types";
import Loading from "./chatroom/[id]/loading";
import InterviewForm from "@/components/forms/InterviewForm";

const situationOptions = {
  BOSS: [
    { value: "BOSS1", label: "Friendly" },
    { value: "BOSS2", label: "Standard" },
    { value: "BOSS3", label: "Strict" },
  ],
  GF_PARENTS: [
    { value: "GF_PARENTS1", label: "Meeting for the first time" },
    { value: "GF_PARENTS2", label: "Conversation over dinner" },
    { value: "GF_PARENTS3", label: "Apologizing for breaking a picture frame" },
  ],
  CLERK: [
    { value: "CLERK1", label: "Negotiate prices" },
    { value: "CLERK2", label: "Ask about the origin of the product" },
    { value: "CLERK3", label: "Complaining about incorrect food orders" },
  ],
} as const;

type Role = keyof typeof situationOptions;
type SituationValue = (typeof situationOptions)[Role][number]["value"];

export default function PersonaAndRoom() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState<"MALE" | "FEMALE" | "NONE">("NONE");
  const DEFAULT_AVATAR = "/characters/character2.png";
  const [relationship, setRelationship] = useState<Role>("BOSS");
  const [description, setDescription] = useState<SituationValue>(
    situationOptions.BOSS[0].value
  );
  useEffect(() => {
    const first = situationOptions[relationship][0].value;
    setDescription(first);
  }, [relationship]);

  const [profileImageUrl, setProfileImageUrl] = useState(DEFAULT_AVATAR);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop() || "";

    try {
      const res = await fetch(`/api/files/presigned-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          fileType: file.type,
          fileExtension: ext,
        }),
      });

      if (!res.ok) throw new Error("Presigned URL 요청 실패");
      const { url } = await res.json();

      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const publicUrl = url.split("?")[0];
      setProfileImageUrl(publicUrl);
      setAvatarModalOpen(false);
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("이미지 업로드 실패");
    } finally {
      e.target.value = ""; // 같은 파일 다시 선택 가능하도록 초기화
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoading(true);
    try {
      const safeProfileImage =
        profileImageUrl && profileImageUrl.trim() !== ""
          ? profileImageUrl
          : DEFAULT_AVATAR;

      const personaRes = await fetch("/api/personas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          company,
          position,
          relationship,
          description,
          profileImageUrl: safeProfileImage,
        }),
      });
      if (!personaRes.ok) throw new Error("Persona 생성 실패");
      const persona: Persona = await personaRes.json();
      const convoRes = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          personaId: persona.personaId,
          situation: description,
        }),
      });
      if (!convoRes.ok) throw new Error("방 생성 실패");
      const convo = await convoRes.json();
      setTimeout(() => {
        router.push(`/main/custom/chatroom/${convo.conversationId}`);
      }, 1500);
    } catch (e: any) {
      alert("생성 실패: " + (e?.message ?? e));
      setShowLoading(false);
    }
  };
  if (showLoading) {
    return <Loading />;
  }
  return (
    <div className="w-full max-w-md mx-5 flex flex-col relative overflow-y-auto bg-white">
      {/* Header */}
      <div className="flex items-center mt-6">
        <button
          onClick={() => router.back()}
          className="text-black cursor-pointer"
        >
          <ChevronLeftIcon className="size-6" />
        </button>
        <h1 className="flex-1 text-center font-semibold text-black text-lg">
          Create
        </h1>
      </div>
      <h2 className=" text-left text-xl font-bold mb-12 px-5 mt-6">
        Interview Preparation
      </h2>

      {/* 사진 업로드 */}
      {/* <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <button
            className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 cursor-pointer"
            onClick={() => setAvatarModalOpen(true)}
          >
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                width={96}
                height={96}
                alt="avatar"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                +
              </div>
            )}
          </button>
        </div>
      </div>

      {avatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setAvatarModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 z-10 shadow-xl flex flex-col items-center gap-4 min-w-[320px]">
            <h2 className="text-lg font-semibold mb-2">Select Avatar</h2>

            <div className="grid grid-cols-3 gap-4">
              {images.map((img, i) => (
                <button
                  key={img}
                  className={`w-20 h-20 rounded-full overflow-hidden border-4 ${
                    profileImageUrl === img
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => {
                    setProfileImageUrl(img);
                    setAvatarModalOpen(false);
                  }}
                >
                  <Image
                    src={img}
                    width={80}
                    height={80}
                    alt={`avatar${i + 1}`}
                  />
                </button>
              ))}
            </div>

            
            <button
              onClick={() =>
                document.getElementById("fileUploadInput")?.click()
              }
              className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 cursor-pointer"
            >
              Upload Your Photo
            </button>
            <input
              id="fileUploadInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              className=" text-gray-400 text-sm underline cursor-pointer"
              onClick={() => setAvatarModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )} */}

      <InterviewForm
        situationOptions={situationOptions}
        relationship={relationship}
      />
    </div>
  );
}
