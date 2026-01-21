import { Info } from "lucide-react";
import { Button } from "../ui/button";
import Modal from "../ui/modal/Modal";

export default function Unfinished({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      title="Unfinished Dialogue Tasks"
      description="To complete the dialogue, you must finish 3 tasks. Are you sure you want to quit?"
      isOpen={isOpen}
      onClose={onClose}
      className="pt-20 bg-white rounded-2xl flex flex-col items-center justify-center gap-3 py-6 px-5 w-83.5 "
    >
      <Info className="text-red-500 size-10 absolute top-2" />
      <div className="flex flex-col gap-3 w-full mt-4 items-center">
        <Button variant="primary" size="md" onClick={onClose}>
          Contiune
        </Button>
        <Button variant="primary" size="md" onClick={onClose}>
          Quit
        </Button>
      </div>
    </Modal>
  );
}
