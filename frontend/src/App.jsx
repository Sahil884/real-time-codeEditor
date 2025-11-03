import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

import Header from "./components/header";
import SideBar from "./components/SideBar";
import UserAvatar from "./components/userAvatar";
import Editor from "@monaco-editor/react";
import ChatBox from "./components/ChatBox";

const socket = io("http://localhost:5000");

const App = () => {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [copySuccess, setCopySuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [files, setFiles] = useState(["main.js", "utils.js", "styles.css"]);
  const [selectedFile, setSelectedFile] = useState("main.js");
  const [fileContents, setFileContents] = useState({
    "main.js": "// start code here",
    "utils.js": "// utility functions",
    "styles.css": "/* styles */",
  });
  const [messages, setMessages] = useState([]);

  const baseFiles = ["main", "utils", "styles"];

  const extensionMap = {
    javascript: "js",
    python: "py",
    java: "java",
    cpp: "cpp",
  };

  useEffect(() => {
    socket.on("userJoined", (users) => {
      setUsers(users);
    });

    socket.on("codeUpdate", ({ code, file }) => {
      setFileContents((prev) => ({ ...prev, [file]: code }));
    });

    socket.on("userTyping", (user) => {
      setTyping(`${user.slice(0, 8)}... is Typing`);
      setTimeout(() => setTyping(""), 2000);
    });

    socket.on("languageUpdate", (newLanguage) => {
      // setLanguage(newLanguage);
      handleLanguageChange({ target: { value: newLanguage } });
    });

    socket.on("fileSelect", ({ file }) => {
      setSelectedFile(file);
    });

    socket.on("chatMessage", ({ user, text }) => {
      setMessages((prev) => [...prev, { user, text }]);
    });

    return () => {
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
      socket.off("fileSelect");
      socket.off("chatMessage");
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.emit("leaveRoom");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const joinRoom = () => {
    if (roomId && userName) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setUserName("");
    setCode("// start code here");
    setLanguage("javascript");
  };

  const sendMessage = (text) => {
    // const message = { user: userName, text };

    // // Show message locally
    // setMessages((prev) => [...prev, message]);

    // Emit to other peers

    socket.emit("chatMessage", { roomId, user: userName, text });
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setFileContents((prev) => ({ ...prev, [selectedFile]: newCode }));

    socket.emit("codeChange", { roomId, code: newCode, file: selectedFile });
    socket.emit("typing", { roomId, userName });
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    socket.emit("fileSelect", { roomId, file });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });

    const newExt = extensionMap[newLanguage];

    // Update file names except styles.css
    const updatedFiles = baseFiles.map((name) =>
      name === "styles" ? "styles.css" : `${name}.${newExt}`
    );
    setFiles(updatedFiles);

    // Update fileContents keys
    setFileContents((prevContents) => {
      const newContents = {};
      baseFiles.forEach((name) => {
        const oldKey = Object.keys(prevContents).find((key) =>
          key.startsWith(name)
        );
        const newKey = name === "styles" ? "styles.css" : `${name}.${newExt}`;
        newContents[newKey] = oldKey
          ? prevContents[oldKey]
          : "// start code here";
      });
      return newContents;
    });

    // Update selected file if it's not styles.css
    if (selectedFile !== "styles.css") {
      const baseSelected = selectedFile.split(".")[0];
      setSelectedFile(`${baseSelected}.${newExt}`);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  if (!joined) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col space-y-6 my-10">
            <h1 className="text-lg text-purple-600 text-center">
              Join Code Room
            </h1>
            <input
              className="bg-white rounded-[8px] py-2 px-1 text-center"
              type="text"
              placeholder="Room Id"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <input
              className="bg-white rounded-[8px] py-2 px-1 text-center"
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm cursor-pointer"
              onClick={joinRoom}
            >
              Join
            </button>
          </div>

          <div className="relative w-full max-w-xl h-40 mt-2">
            <img
              src="avatar1.jpg"
              className="absolute top-0 left-10 w-12 h-12 rounded-full border-2 border-white shadow-lg animate-bounce"
              alt="Avatar 1"
            />
            <img
              src="avatar2.webp"
              className="absolute top-10 right-20 w-12 h-12 rounded-full border-2 border-white shadow-lg animate-pulse"
              alt="Avatar 2"
            />
            <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-3xl animate-fade">
              🔥 💡 🎉
            </span>
          </div>

          <footer className="text-center fixed bottom-2 text-sm text-gray-500">
            <a href="#" className="mx-2 hover:underline">
              GitHub
            </a>
            <a href="#" className="mx-2 hover:underline">
              About
            </a>
            <a href="#" className="mx-2 hover:underline">
              Privacy
            </a>
          </footer>
        </div>
      </>
    );
  }

  return (
    <div className="grid grid-cols-[20%_55%_25%] h-auto">
      {/* side Bar */}
      <SideBar
        copyfunc={copyRoomId}
        isCopied={copySuccess}
        roomId={roomId}
        language={language}
        langfunc={handleLanguageChange}
        userTyping={typing}
        clickfunc={leaveRoom}
        files={files}
        selectedFile={selectedFile}
        onSelectFile={handleFileSelect}
      />

      {/* code editor space */}
      <div className="  ">
        <main className="flex-1 flex flex-col bg-white">
          {/* <!-- Header --> */}
          <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-100">
            <span className="font-semibold text-sm">{selectedFile}</span>
            <div className="flex items-center space-x-2">
              <ul className="flex gap-1.5">
                {users.map((user, index) => (
                  <li key={index}>
                    <UserAvatar username={user} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* <!-- Monaco Editor Placeholder --> */}
          <div className="h-[92vh] ">
            <Editor
              height={"100%"}
              defaultLanguage={language}
              language={language}
              value={fileContents[selectedFile]}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
          </div>
        </main>
        {/* <div className=""></div> */}
      </div>

      {/* chat sidebar */}
      <div className=" ">
        <ChatBox
          messages={messages}
          onSend={sendMessage}
          currentUser={userName}
        />
      </div>
    </div>
  );
};

export default App;
