import { Info } from "lucide-react";
import { Button } from "../ui/button";
import Modal from "../ui/modal/Modal";
import { useRouter } from "next/navigation";

export default function Sucess({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  return (
    <Modal
      title="Sign up to save your interview and view yout feedback"
      description="Viewing yout learning report will cost 40 credits"
      isOpen={isOpen}
      onClose={onClose}
      className="pt-20 bg-white rounded-2xl flex flex-col items-center justify-center gap-3 py-6 px-5 w-83.5 "
    >
      <Info className="text-green-500 size-10 absolute top-4" />
      <div className="flex flex-col gap-3 w-full mt-4 items-center">
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push("/signup")}
        >
          Sign up
        </Button>
      </div>
    </Modal>
  );
}
