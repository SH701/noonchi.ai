"use client";

import { ActionButton, Back } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Billing() {
  const [selectedPack, setSelectedPack] = useState("level-up");
  const router = useRouter();
  const queryClient = useQueryClient();
  const packs = [
    {
      id: "starter",
      name: "Starter pack",
      credits: 300,
      price: "$4.99",
      features: [
        "Try Noonchi beyond the free trial",
        "Enough for about 10 real-life missions or 1–2 mock interviews plus some tone checks",
      ],
    },
    {
      id: "level-up",
      name: "Level Up pack",
      credits: 900,
      price: "$9.99",
      popular: true,
      features: [
        "For using Noonchi in daily Korean life",
        "About 30 missions, or a mix of 4–5 mock interviews + daily tone fixes",
      ],
    },
    {
      id: "pro",
      name: "Pro pack",
      credits: 2000,
      price: "$17.99",
      features: [
        "For people who`ll use Noonchi every week",
        "Enough for 60+ missions and up to 10 mock interviews",
      ],
    },
  ];
  const handleCharge = async () => {
    const charge = await apiFetch("/api/users/credit/charge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 50,
      }),
    });
    const creditUpdate = await apiFetch("/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    queryClient.invalidateQueries({
      queryKey: ["userProfile"],
    });
    return { charge, creditUpdate };
  };
  return (
    <div className="max-h-screen bg-gray-50">
      <div className="w-full max-w-sm mx-auto bg-gray-50 min-h-screen flex flex-col pt-12">
        <Back />

        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Choose Your credit pack
        </h1>

        <div className="px-4 space-y-4 flex-1 pb-24 items-center justify-center">
          {packs.map((pack) => (
            <div
              key={pack.id}
              onClick={() => setSelectedPack(pack.id)}
              className={` rounded-xl py-5 px-4 cursor-pointer transition-all ${
                selectedPack === pack.id
                  ? "border border-blue-600 shadow-lg bg-blue-50"
                  : " shadow"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className=" font-medium text-gray-900">{pack.name}</h3>
                  {pack.popular && (
                    <span className="bg-blue-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                {selectedPack === pack.id && (
                  <div className="bg-blue-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-blue-500">
                    {pack.credits.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">credits</span>
                </div>
                <div className="text-sm text-gray-600">/ {pack.price}</div>
              </div>

              <div className="space-y-2">
                {pack.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-1">
                    <Check className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className=" flex items-center justify-center mt-6">
            <ActionButton
              onClick={() => {
                handleCharge().then(() => router.push("/main"));
              }}
            >
              Get Credits
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
