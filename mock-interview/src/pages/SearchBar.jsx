import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ placeholder, onChange }) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white w-full ">
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="flex-1 p-2 outline-none"
      />
      <div className="bg-gray-700 p-2 text-white">
        <Search />
      </div>
    </div>
  );
}
