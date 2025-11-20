// components/forms/SubmitButton.tsx

export default function SubmitButton() {
  return (
    <button
      type="submit"
      className="w-full py-3 bg-blue-500 text-white text-sm font-semibold rounded-lg mt-2 hover:bg-blue-600 transition-colors disabled:opacity-50 mb-3 cursor-pointer"
    >
      Start Chatting
    </button>
  );
}
