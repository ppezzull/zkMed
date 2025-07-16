"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "~~/lib/utils";

interface ProductOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const productOptions: ProductOption[] = [
  {
    id: "insurance",
    name: "Insurance Portal",
    description: "Manage claims and verify patient data privately",
    icon: "🛡️",
  },
  {
    id: "hospital",
    name: "Hospital Dashboard",
    description: "Access patient records with zero-knowledge proofs",
    icon: "🏥",
  },
  {
    id: "patient",
    name: "Patient Access",
    description: "Control your medical data with privacy",
    icon: "👤",
  },
];

export const ProductDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<ProductOption | null>(null);

  const handleSelect = (option: ProductOption) => {
    setSelected(option);
    setIsOpen(false);
    // Add navigation logic here based on the selected option
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 px-4 py-2 text-sm font-medium",
          "text-gray-300 hover:text-white transition-colors duration-200",
        )}
      >
        <span>{selected?.name || "Products"}</span>
        <ChevronDownIcon className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700 z-50">
          <div className="p-2">
            {productOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                className="w-full text-left p-3 rounded-md hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <div className="font-medium text-white">{option.name}</div>
                    <div className="text-sm text-gray-400">{option.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
