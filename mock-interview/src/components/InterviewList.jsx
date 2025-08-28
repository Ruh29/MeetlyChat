// import { useState } from "react";
//  import { format } from "date-fns";
// import InterviewCard from "./InterviewCards";

// export default function InterviewList({ title, interviews }) {
//   const [isOpen, setIsOpen] = useState(true);

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-4">
//       <div
//         className="flex justify-between items-center cursor-pointer"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <h2 className="text-lg font-semibold">{title}</h2>
//         <span className="text-indigo-600">{isOpen ? "−" : "+"}</span>
//       </div>

//       {isOpen && (
//         <div className="mt-4 space-y-3">
//           {interviews.map((interview, index) => (
//             <InterviewCard
//               key={index}
//               title={interview.title}
//               date={format(new Date(interview.date), "dd MMM yyyy")}
//               time={interview.time}
//               description={interview.description}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import { format } from "date-fns";
import InterviewCard from "./InterviewCards";

export default function InterviewList({ title, interviews }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-indigo-600">{isOpen ? "−" : "+"}</span>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-3">
          {interviews.map((interview, index) => (
            <InterviewCard
              key={index}
              title={interview.title}
              date={format(new Date(interview.date), "dd MMM yyyy")}
              time={interview.time}
              description={interview.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}
