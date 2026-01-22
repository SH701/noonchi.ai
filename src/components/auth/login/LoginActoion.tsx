import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  loading: boolean;
  handleLogin: () => void;
  isValid: boolean;
}

export default function LoginAction({ loading, handleLogin, isValid }: Props) {
  return (
    <>
      <div className="flex items-center justify-center">
        <Button
          variant="primary"
          onClick={handleLogin}
          disabled={!isValid || loading}
          size="lg"
        >
          Log in
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500">
        First time here?{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-blue-500 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
