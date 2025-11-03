// // components/ChatBox.jsx
// import { useState } from "react";

// const ChatBox = ({ messages, onSend }) => {
//   const [input, setInput] = useState("");

//   const handleSend = () => {
//     if (input.trim()) {
//       onSend(input);
//       setInput("");
//     }
//   };

//   return (
//     <div className="flex flex-col h-full p-4 bg-gray-100 border-l">
//       <h2 className="text-lg font-semibold mb-2">💬 Chat</h2>
//       <div className="flex-1 overflow-y-auto mb-2 space-y-1 text-sm">
//         {messages.map((msg, index) => (
//           <div key={index} className="bg-white p-2 rounded shadow-sm">
//             <strong>{msg.user}:</strong> {msg.text}
//           </div>
//         ))}
//       </div>
//       <div className="flex space-x-2">
//         <input
//           className="flex-1 px-2 py-1 border rounded"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button
//           className="bg-blue-600 text-white px-3 py-1 rounded"
//           onClick={handleSend}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useState, useRef, useEffect } from "react";

const ChatBox = ({ messages, onSend, currentUser }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-screen p-4 bg-gray-100 border-l">
      <h2 className="text-lg font-semibold mb-2">💬 Chat</h2>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.map((msg, index) => {
          const isSender = msg.user === currentUser;
          return (
            <div
              key={index}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg shadow ${
                  isSender
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {!isSender && (
                  <div className="text-xs font-semibold text-purple-600 mb-1">
                    {msg.user}
                  </div>
                )}
                <div className="text-sm">{msg.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="flex space-x-2">
        <input
          className="flex-1 px-3 py-2 border rounded-full focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
