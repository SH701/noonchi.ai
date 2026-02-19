import { ModalProps } from "@/types/etc";
import Modal from "./Modal";
import { Button } from "../ui/button/button";
import { useModalActions } from "@/store/modal/useModalStore";
import { LoginContent, SignupContent } from "@/features/auth";


export default function PreviewModal({ isOpen, onClose }: ModalProps) {
  const { openModal } = useModalActions();
  const loginOpen = () => {
    onClose();
    openModal(<LoginContent />);
  };
  const signupOpen = () => {
    onClose();
    openModal(<SignupContent />);
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`You're doing great!\nReady for the next level?`}
        description={`The roleplay preview has ended.\nSign up to continue the dialogue \nand master every situation.`}
        image={{ src: "/etc/eyes.png", alt: "eyes", width: 100, height: 100 }}
      >
        <div className="flex flex-col gap-3">
          <Button onClick={signupOpen}>Create Account</Button>
          <Button onClick={loginOpen} variant="secondary">
            Login
          </Button>
        </div>
      </Modal>
    </>
  );
}
