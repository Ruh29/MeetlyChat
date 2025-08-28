import React from "react";
export default function InterviewCard({ title, date, time, description }) {
  return (
    <div className="  p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-500 text-sm">{date} • {time}</p>
      <p className="mt-2 text-gray-700">{description}</p>
      <button className="bg-indigo-600 mt-2 text-white px-4 py-2 rounded">
          Start Mock Interview
        </button>
    </div>
  );
}
