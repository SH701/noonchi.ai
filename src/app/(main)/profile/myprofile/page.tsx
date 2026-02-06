import MyInfo from "@/components/profile/myinfo/MyInfo";
import { getAge } from "@/lib/common/time-format";
import { auth } from "@/lib/next-auth/auth";

export default async function MyProfile() {
  const session = await auth();
  return (
    <div>
      <MyInfo
        name={session?.user.name ?? "User"}
        age={getAge(session?.user.birthDate ?? "")}
      />
    </div>
  );
}
