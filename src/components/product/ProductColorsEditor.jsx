import React from "react";
import { Input } from "../ui";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function ProductColorsEditor({
  product,
  setProduct,
  handleChangeProduct,
}) {
  const handleRemoveColor = (i) => {
    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== i),
    }));
  };

  const handleAddColor = () => {
    setProduct((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), { name: "", value: "" }],
    }));
  };

  return (
    <div className="rounded-lg border shadow-sm border-gray-300 p-2">
      {product.colors?.map((c, i) => (
        <div key={i} className="flex gap-2 mt-2 items-center">
          {/* Color name input */}
          <Input
            type="text"
            value={c.name}
            onChange={(e) => handleChangeProduct(e, i, "name", "colors")}
            placeholder="Color Name"
            className="border rounded p-2 flex-1"
          />

          {/* Color picker */}
          <label className="relative">
            <input
              type="color"
              value={c.value || "#000000"}
              onChange={(e) => handleChangeProduct(e, i, "value", "colors")}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="h-10 w-10 rounded-full border border-gray-300 cursor-pointer flex items-center justify-center transition-all duration-300"
              style={{
                background: c.value
                  ? c.value
                  : "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
              }}
            >
              {!c.value && (
                <div className="flex items-center justify-center bg-white rounded-full w-7 h-7">
                  <span className="text-black text-2xl font-bold leading-none">
                    +
                  </span>
                </div>
              )}
            </div>
          </label>

          {/* Delete color button */}
          <button
            onClick={() => handleRemoveColor(i)}
            className="bg-red-50 text-red-500 border border-gray-200 p-2 rounded-full shadow-sm 
                       hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 
                       focus:ring-red-400 transition mb-1"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ))}

      {/* Add new color button */}
      <button
        onClick={handleAddColor}
        className="mt-2 bg-[#87a736] text-white px-4 py-1 rounded w-full md:w-auto shadow-sm"
      >
        + Add Color
      </button>
    </div>
  );
}
