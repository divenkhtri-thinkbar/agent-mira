import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RadioButtonGroupProps {
  options: Array<{ id: string; text: string }>;
  onSelect: (selectedOptions: Array<{ id: string; text: string }>) => void;
  onSkip: () => void;
  onSubmit: () => void;
}

export function RadioButtonGroup({ options, onSelect, onSkip, onSubmit }: RadioButtonGroupProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // New state for submission

  const handleOptionClick = (option: { id: string; text: string }) => {
    if (isSubmitted) return; // Disable interaction after submission

    const newSelectedIds = selectedOptionIds.includes(option.id)
      ? selectedOptionIds.filter((id) => id !== option.id)
      : [...selectedOptionIds, option.id];

    setSelectedOptionIds(newSelectedIds);

    const selectedOptions = options.filter((opt) => newSelectedIds.includes(opt.id));
    onSelect(selectedOptions);
  };

  const handleSubmit = () => {
    setIsSubmitted(true); // Mark as submitted
    onSubmit(); // Trigger parent onSubmit
  };

  return (
    <div className="space-y-3 w-full max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleOptionClick(option)}
              className={`flex items-center gap-2 py-2 px-4 rounded-full transition-colors ${
                isSubmitted
                  ? isSelected
                    ? "bg-white text-[#1E293B]"
                    : "bg-white/50 text-[#1E293B]"
                  : isSelected
                  ? "bg-[#1354B6] text-white"
                  : "bg-[#B8D4FF] text-[#1E293B]"
              } ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
              disabled={isSubmitted} // Disable button after submission
            >
              {/* Radio circle */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  isSubmitted
                    ? isSelected
                      ? "bg-[#1354B6]"
                      : "bg-white border border-gray-300"
                    : isSelected
                    ? "bg-white"
                    : "bg-white border border-gray-300"
                }`}
              >
                {/* Inside radio dot */}
                {isSelected && (
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isSubmitted ? "bg-[#37D3AE]" : "bg-[#37D3AE]"
                    }`}
                  />
                )}
              </div>
              <span className="font-medium text-sm">{option.text}</span>
            </button>
          );
        })}
      </div>

      {/* Skip and Submit Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button
          variant="outline"
          onClick={onSkip}
          className="rounded-full py-2 bg-[#8EACD9] text-white border-none hover:bg-[#7A99C6] shadow-sm"
          disabled={isSubmitted} // Disable Skip after submission
        >
          Skip
        </Button>
        <Button
          variant="default"
          onClick={handleSubmit}
          disabled={selectedOptionIds.length === 0 || isSubmitted} // Disable if no selection or already submitted
          className="rounded-full py-2 bg-[#1354B6] text-white hover:bg-blue-700 shadow-sm disabled:opacity-70"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default RadioButtonGroup;