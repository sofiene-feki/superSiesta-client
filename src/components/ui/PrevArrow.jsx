import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute shadow-2xl top-1/2 -left-10 -translate-y-1/2 z-10 
                 bg-white h-30 w-10  shadow-lg 
                 hover:bg-gray-100 transition flex items-center justify-center"
    >
      <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
    </button>
  );
}
