"use client";

import { useRouter } from "next/navigation";
import { apiMutations } from "@/api/mutations";
import { toast } from "@/components/ui/toast/toast";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button/button";


export default function Logout() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await apiMutations.auth.logout();
      await signOut({ redirect: false });
      router.push("/");
      toast.success("You are logged out");
    } catch {
      toast.error("Logout failed");
    }
  };
  return (
    <Button onClick={handleLogout} size="lg">
      Log out
    </Button>
  );
}
