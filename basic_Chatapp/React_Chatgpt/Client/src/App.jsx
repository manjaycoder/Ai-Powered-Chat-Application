import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Only scroll when messages change

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() !== "") {
      socket.emit("message", messageInput);
      setMessages((prevMessages) => [...prevMessages, messageInput]); // Append the new message
      setMessageInput(""); // Reset input
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white flex flex-col">
      {/* Header */}
      <header className="bg-black bg-opacity-30 py-4 px-6 shadow-lg">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="text-indigo-300">Chat</span>
            <span className="text-pink-300">App</span>
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full flex items-center">
              {isConnected ? (
                <>
                  <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                  Online
                </>
              ) : (
                "Offline"
              )}
            </span>
          </h1>
          <button className="text-sm bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-full transition-all">
            Settings
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden p-4 max-w-4xl w-full mx-auto">
        <div className="h-full flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <div className="text-center p-6 rounded-xl bg-black bg-opacity-20 max-w-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <h3 className="text-xl font-medium mb-1">No messages yet</h3>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="flex items-start group">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                    U
                  </div>
                  <div className="bg-black bg-opacity-30 rounded-2xl px-4 py-2 max-w-xs lg:max-w-md">
                    <p className="text-white">{message}</p>
                    <div className="text-right mt-1">
                      <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={sendMessage}
            className="bg-black bg-opacity-30 rounded-xl p-1 shadow-lg"
          >
            <div className="flex items-center">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-white placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className={`p-2 rounded-full mr-1 transition-all ${
                  messageInput.trim()
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "text-gray-500 cursor-not-allowed"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-3 bg-black bg-opacity-20">
        <p>© {new Date().getFullYear()} ChatApp. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
