"use client";

import { useRef, useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { useAuthStore } from "@/store/useAuth";
import { useUserProfile } from "@/hooks/queries/useUserProfile";
import {
  Character0,
  Character1,
  Character2,
  Character3,
} from "@/components/character";

type Profile = {
  email: string;
  nickname: string;
  koreanLevel: string;
  profileImageUrl: string;
  interests: string[];
};

const FACES = [
  { Component: Character0, id: "face0" },
  { Component: Character1, id: "face1" },
  { Component: Character2, id: "face2" },
  { Component: Character3, id: "face3" },
];

export default function ProfileEditPage() {
  const router = useRouter();

  const accessToken = useAuthStore((s) => s.accessToken);
  const selectedFace = useAuthStore((s) => s.selectedFace);
  const setSelectedFace = useAuthStore((s) => s.setSelectedFace);
  const profileImageUrl = useAuthStore((s) => s.profileImageUrl);
  const setProfileImageUrl = useAuthStore((s) => s.setProfileImageUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading, error: rqError } = useUserProfile();

  const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);
  const [nickname, setNickname] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setOriginalProfile(profile.user);
    setNickname(profile.user.nickname);
    setProfileImageUrl(profile.user.profileImageUrl);

    const faceIndex = FACES.findIndex(
      (f) => f.id === profile.user.profileImageUrl
    );
    if (faceIndex >= 0) {
      setSelectedFace(faceIndex);
    } else {
      setSelectedFace(null);
    }
  }, [profile, setProfileImageUrl, setSelectedFace]);

  const openFileDialog = () => fileInputRef.current?.click();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);

    const ext = file.name.split(".").pop()!;

    const presignRes = await fetch("/api/files/presigned-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        fileType: file.type,
        fileExtension: ext,
        fileName: file.name,
      }),
    });
    const { url: uploadUrl } = await presignRes.json();

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadRes.ok) {
      setLocalError("Image upload failed");
      return;
    }

    const publicUrl = uploadUrl.split("?")[0];
    setProfileImageUrl(publicUrl);
    setSelectedFace(null);

    await fetch("/api/users/me/profile", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ profileImageUrl: publicUrl }),
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!originalProfile) return;

    setSubmitting(true);
    setLocalError(null);

    const body: Partial<{ nickname: string; profileImageUrl: string }> = {};

    if (nickname !== originalProfile.nickname) {
      body.nickname = nickname;
    }

    if (selectedFace !== null) {
      const faceId = FACES[selectedFace].id;
      if (faceId !== originalProfile.profileImageUrl) {
        body.profileImageUrl = faceId;
      }
    } else if (
      profileImageUrl &&
      profileImageUrl !== originalProfile.profileImageUrl
    ) {
      body.profileImageUrl = profileImageUrl;
    }

    if (!Object.keys(body).length) {
      setSubmitting(false);
      return;
    }

    const res = await fetch("/api/users/me/profile", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setLocalError(data.message ?? "Update failed");
      setSubmitting(false);
      return;
    }

    router.push("/profile");
  };

  if (isLoading) return <p className="text-center mt-10">Loading…</p>;
  if (rqError)
    return (
      <p className="text-center text-red-500 mt-10">Failed to load profile.</p>
    );
  if (!originalProfile)
    return <p className="text-center mt-10">Loading profile…</p>;

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto p-4 space-y-6 mt-15">
      <div className="relative py-4">
        <Link
          href="/profile"
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </Link>
        <h2 className="text-lg font-semibold text-center">Edit Profile</h2>
      </div>

      <div className="flex justify-center">
        <div
          onClick={openFileDialog}
          className="w-30 h-30 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden cursor-pointer"
        >
          {profileImageUrl ? (
            profileImageUrl.startsWith("http") ||
            profileImageUrl.startsWith("/") ? (
              <Image
                src={profileImageUrl}
                alt="avatar"
                width={120}
                height={120}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              (() => {
                const C = FACES.find(
                  (f) => f.id === profileImageUrl
                )?.Component;
                return C ? <C className="w-full h-full" /> : null;
              })()
            )
          ) : (
            <div className="w-full h-full bg-blue-100" />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Nickname"
            maxLength={15}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {nickname && (
            <button
              type="button"
              onClick={() => setNickname("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400 mb-10">
          Nickname should be 15 characters or less
        </p>
      </div>

      <p className="text-center text-gray-600">Pick your favorite one!</p>

      <div className="flex justify-center space-x-4">
        {FACES.map(({ Component, id }, idx) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setSelectedFace(idx);
              setProfileImageUrl(id);
            }}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
              selectedFace === idx ? "border-blue-500" : "border-gray-200"
            } bg-gray-100`}
          >
            <Component className="w-8 h-8" />
          </button>
        ))}
      </div>

      {localError && <p className="text-red-500 text-center">{localError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
      >
        {submitting ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
