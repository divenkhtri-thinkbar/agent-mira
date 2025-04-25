import React, { useState } from "react";
import DropdownMobileRightCard from "./DropdownMobileRightCard"; // Adjust the import path

const labels = {
  options: [
    "Show Price Trends",
    "Show Supply and Demand",
    "Show Market Type"
  ]
};

const AccordionContainer: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null); // Tracks the expanded label

  const handleToggleContent = (label: string) => {
    setExpandedCard((prev) => (prev === label ? null : label)); // Toggle: close if open, open if closed
  };

  return (
    <div className="space-y-4"> {/* Add spacing between cards */}
      {labels.options.map((label) => (
        <DropdownMobileRightCard
          key={label} // Use label as a unique key
          label={label}
          isExpanded={expandedCard === label}
          onToggle={() => handleToggleContent(label)}
        />
      ))}
    </div>
  );
};

export default AccordionContainer;