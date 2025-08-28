import React, { useState } from "react";

const SendEmailToShortlisted = ({ shortlistedCandidates=[] }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!subject || !message) {
      alert("Please fill subject & message");
      return;
    }
    alert(`Emails sent to ${shortlistedCandidates.length} candidates!`);
    setSubject("");
    setMessage("");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-3">Send Email to Shortlisted</h2>
      <p className="text-sm mb-2">
        Total Shortlisted: {shortlistedCandidates.length}
      </p>
      <input
        type="text"
        placeholder="Email Subject"
        className="border p-2 w-full mb-2 rounded"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Email Message"
        className="border p-2 w-full mb-2 rounded h-24"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send Email
      </button>
    </div>
  );
};

export default SendEmailToShortlisted;
