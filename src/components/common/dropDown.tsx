import { useState } from "react";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select an option");

  const options = [
    "Just getting started",
    "Casually looking",
    "Actively looking",
    "Ready to close",
  ];

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Main dropdown container with dynamic rounding */}
      <label className="mb-2 font-[Geologica] block font-light text-lg text-[#fff]">
        What stage are you at in your home journey?
      </label>
      <div
        className={`w-full bg-white border border-gray-300 shadow-sm ${
          isOpen ? "rounded-[24px]" : "rounded-full"
        }`}
      >
        {/* Selected option / Trigger with fixed chevron */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 text-left relative h-[45px]"
        >
          <span
            className={`block truncate ${
              selectedOption === "Select an option"
                ? "font-[Geologica] font-light text-lg text-[#959595]"
                : "font-[ClashDisplay-Medium] text-lg text-[#1354B6]"
            }`}
          >
            {selectedOption}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>

        {/* Options list - Expands within the same box, without affecting the chevron */}
        {isOpen && (
          <div className="overflow-hidden transition-all duration-300">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none font-[ClashDisplay-Medium] text-lg text-[#1354B6]"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
