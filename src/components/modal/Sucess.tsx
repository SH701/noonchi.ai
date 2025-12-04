import { Info } from "lucide-react";
import { ModalButton } from "../ui/button";
import Modal from "../ui/modal/Modal";

export default function Sucess({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      title="Log in to save your interview and view yout feedback"
      description="Viewing yout learning report will cost 50 credits"
      isOpen={isOpen}
      onClose={onClose}
      className="pt-20 bg-white rounded-2xl flex flex-col items-center justify-center gap-3 py-6 px-5 w-[334px] "
    >
      <Info className="text-green-500 size-10 absolute top-4" />
      <div className="flex flex-col gap-3 w-full mt-4 items-center">
        <ModalButton label="Log in" onClick={onClose} />
      </div>
    </Modal>
  );
}
