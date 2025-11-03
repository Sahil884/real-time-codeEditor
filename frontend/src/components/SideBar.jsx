const SideBar = ({
  roomId,
  copyfunc,
  isCopied,
  language,
  langfunc,
  userTyping,
  clickfunc,
  files,
  onSelectFile,
  selectedFile,
}) => {
  return (
    <div className="bg-gray-900 text-white p-4 border-white border-r-2 h-[100vh] flex flex-col justify-between ">
      {/* file tree */}
      <div>
        <h2 className="font-semibold mb-2">📁 Files</h2>
        <ul className="space-y-1 text-sm">
          {files.map((file, index) => (
            <li
              key={index}
              className={`cursor-pointer px-2 py-1 rounded ${
                selectedFile === file
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => onSelectFile(file)}
            >
              {file}
            </li>
          ))}
        </ul>

        <div className="mt-7 ">
          <div className="flex flex-col h-full">
            <h2 className="text-lg font-bold"> Room Code: {roomId}</h2>
            <button
              className="bg-gray-700 mt-4 py-1 rounded-[5px] cursor-pointer"
              onClick={copyfunc}
            >
              Copy Id
            </button>
            {isCopied && (
              <span className="text-center animate-pulse">{isCopied}</span>
            )}

            {/* typing indicator */}
            <p className="mt-10 text-center">{userTyping}</p>

            <select
              className="mt-14 w-full text-center font-semibold bg-gray-700 text-white py-1 rounded-[5px]"
              value={language}
              onChange={langfunc}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={clickfunc}
        className=" mt-28 left-2 w-full bg-red-700 px-2 py-2.5 rounded-sm cursor-pointer  text-center"
      >
        Leave Room
      </button>
    </div>
  );
};

export default SideBar;
