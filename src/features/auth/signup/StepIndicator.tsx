interface StepIndicatorProps {
  currentStep: number;
  totalStep: number;
}

export default function StepIndicator({
  currentStep,
  totalStep,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center pt-7">
      {Array.from({ length: totalStep }, (_, i) => i + 1).map((num, index) => (
        <div key={num} className="flex items-center">
          <div
            className={`size-8 rounded-full p-2 flex justify-center items-center ${
              currentStep === num
                ? "bg-[#E7EDFF] border border-white shadow-[0_0_12px_0_rgba(31,84,255,0.20)]"
                : "bg-gray-50 text-gray-300"
            }`}
          >
            <p>{num}</p>
          </div>
          {index < totalStep - 1 && (
            <div className="w-6 border-t-2 border-dashed border-[#B8C9FF] mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}
