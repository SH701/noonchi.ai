import {
  ProfileInfo,
  ProfileMenuList,
  ProfileHeader,
  Logout,
  DeleteAccount,
} from "@/features/profile";
import { auth } from "@/lib/next-auth/auth";
import {
  UserRound,
  SlidersHorizontal,
  Languages,
  LayoutGrid,
} from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div className="flex flex-col max-w-93.75">
      <ProfileHeader />
      <div className="space-y-5">
        <ProfileInfo
          img={session?.user.profileImageUrl}
          name={session?.user.name ?? "User"}
        />
        <div>
          <ProfileMenuList
            title="Personal settings"
            items={[
              {
                label: "My Profile",
                href: "/profile/myprofile",
                icon: <UserRound size={18} />,
              },
              {
                label: "Topics of Interest",
                href: "/profile/interest",
                icon: <SlidersHorizontal size={18} />,
              },
              {
                label: "Language",
                href: "/profile/language",
                icon: <Languages size={18} />,
              },
              {
                label: "Subscription Management",
                href: "/profile/subscription",
                icon: <LayoutGrid size={18} />,
              },
            ]}
          />
        </div>
        <div>
          <ProfileMenuList
            title="Need Help?"
            items={[
              { label: "About Chatting", href: "/profile" },
              { label: "About Chatting", href: "/profile" },
              { label: "About Chatting", href: "/profile" },
            ]}
          />
        </div>
        <div>
          <ProfileMenuList
            title="Legal"
            items={[
              { label: "Privacy policy", href: "/profile" },
              { label: "Money-back Policy", href: "/profile" },
              { label: "Terms of Use", href: "/profile" },
            ]}
          />
        </div>
        <div className="flex flex-col gap-2 pb-6">
          <Logout />
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
