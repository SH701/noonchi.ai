import { ModalProps } from "@/types/etc";
import Modal from "../ui/modal/Modal";
import { Button } from "../ui/button";

export default function ComingSoonModal({ isOpen, onClose }: ModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="This feature is coming soon"
      description={`Sorry for the inconvenience.\nWe're preparing a better experience for you`}
    >
      <div className="flex items-center justify-center">
        <Button variant="primary" size="md" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
