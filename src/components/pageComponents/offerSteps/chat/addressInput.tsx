import { Input } from "@/components/ui/input";
import { useState } from "react";
import textData from "@/config/text.json";

interface AddressInputProps {
  onSubmit: (address: string) => void;
}

export function AddressInput({ onSubmit }: AddressInputProps) {
  const [address, setAddress] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const suggestions = textData.step1Content.addressSuggestions; 

  const renderSuggestion = (suggestion: string, input: string) => {
    if (!input) return suggestion;

    const index = suggestion.toLowerCase().indexOf(input.toLowerCase());
    if (index === -1) return suggestion;

    const beforeMatch = suggestion.slice(0, index);
    const match = suggestion.slice(index, index + input.length);
    const afterMatch = suggestion.slice(index + input.length);

    return (
      <>
        {beforeMatch}
        <span className="font-bold">{match}</span>
        {afterMatch}
      </>
    );
  };

  // Handle input change and show suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setShowSuggestions(true);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setAddress(suggestion);
    setShowSuggestions(false);
    setIsSubmitted(true);
    onSubmit(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && address) {
      setShowSuggestions(false);
      setIsSubmitted(true);
      onSubmit(address);
    }
  };

  return (
    <div className="space-y-0 sm:w-full w-[300px]">
      <div className="agentChat py-2 pl-2 pr-6 text-nowrap">
        Enter the address of the property here...
      </div>
      {isSubmitted ? (
        <div className="flex items-center gap-0">
          <div className="bg-white/80 rounded-full p-3 px-4 text-[#272727] w-full">
            {address}
          </div>
        </div>
      ) : (
        <div className="bg-[#F7F7F7] rounded-xl ">
          <Input
            value={address}
            onChange={handleInputChange}
            placeholder=""
            className="bg-white rounded-xl"
            onKeyDown={handleKeyDown}
          />
          {showSuggestions && address && (
            <div className="overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  {renderSuggestion(suggestion, address)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AddressInput;