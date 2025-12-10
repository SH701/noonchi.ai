/* eslint-disable react-hooks/exhaustive-deps */
 
"use client";

import React, { useRef, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/auth/useAuth";

const FACES: string[] = [
  "/characters/character1.png",
  "/characters/character2.png",
  "/characters/character3.png",
  "/characters/character4.png",
];

export default function ProfileChange() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accessToken = useAuthStore((s) => s.accessToken);
  const selectedFace = useAuthStore((s) => s.selectedFace);
  const setSelectedFace = useAuthStore((s) => s.setSelectedFace);

  const profileImageUrl = useAuthStore((s) => s.profileImageUrl);
  const setProfileImageUrl = useAuthStore((s) => s.setProfileImageUrl);

  const handleFaceSelect = (idx: number) => {
    setSelectedFace(idx);
    setProfileImageUrl(FACES[idx]);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!profileImageUrl) return;

    if (profileImageUrl.startsWith("/characters/")) {
      const idx = FACES.findIndex((f) => f === profileImageUrl);
      setSelectedFace(idx !== -1 ? idx : null);
    } else {
      setSelectedFace(null);
    }
  }, [profileImageUrl]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const ext = file.name.split(".").pop() || "";

      const presignRes = await fetch("/api/files/presigned-url", {
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

      if (!presignRes.ok) {
        console.error("Presign failed", await presignRes.text());
        return;
      }

      const { url: uploadUrl } = await presignRes.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        console.error("Upload failed", await uploadRes.text());
        return;
      }

      const publicUrl = uploadUrl.split("?")[0];
      setProfileImageUrl(publicUrl);
      setSelectedFace(null);
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="px-4 pt-8 flex flex-col items-center w-full">
      <h2 className="text-xl font-semibold mb-4">Please select a profile</h2>

      {/* 메인 프로필 표시 원 */}
      <div
        onClick={openFileDialog}
        className="rounded-full bg-gray-100 border-2 border-blue-500 overflow-hidden flex items-center justify-center cursor-pointer mb-6"
        style={{ width: "152px", height: "152px" }}
      >
        {selectedFace !== null ? (
          <Image
            src={FACES[selectedFace]}
            alt="avatar"
            width={152}
            height={152}
            className="object-cover"
            priority
          />
        ) : profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt="avatar"
            width={152}
            height={152}
            className="object-cover"
            priority
          />
        ) : (
          <span className="text-gray-400">Click to upload</span>
        )}
      </div>

      {/* 숨겨진 파일 업로드 UI */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      <p className="text-center text-gray-600 text-sm mt-6">
        Pick your favorite one!
      </p>

      {/* 아바타 선택 그리드 */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        {FACES.map((src, idx) => (
          <button
            key={src}
            onClick={() => handleFaceSelect(idx)}
            className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2 transition ${
              selectedFace === idx ? "border-blue-600" : "border-gray-300"
            }`}
          >
            <Image
              src={src}
              alt={`avatar-${idx + 1}`}
              width={48}
              height={48}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
