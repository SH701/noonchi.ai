"use client";

import { Button } from "@/components/ui/button/button";

export default function GenderToggle({
  gender,
  setGender,
}: {
  gender: "MALE" | "FEMALE";
  setGender: (g: "MALE" | "FEMALE") => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Gender
      </label>
      <div className="flex space-x-4">
        <Button
          variant={gender === "MALE" ? "primary" : "secondary"}
          onClick={() => setGender("MALE")}
        >
          Male
        </Button>
        <Button
          variant={gender === "FEMALE" ? "primary" : "secondary"}
          onClick={() => setGender("FEMALE")}
        >
          Female
        </Button>
      </div>
    </div>
  );
}
