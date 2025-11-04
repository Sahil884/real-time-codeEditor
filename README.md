🔗 CodeRoom: Real-Time Collaborative Code Editor with Chat
Welcome to CodeRoom, a full-stack web application that enables developers to collaborate in real-time on code, chat, and share ideas—all within a shared virtual room. Built with React, Monaco Editor, Socket.IO, and a playful, intuitive UI, CodeRoom is perfect for pair programming, interviews, or remote team collaboration.

🚀 Features
- 🧠 Real-Time Code Sync — Changes in the editor are instantly reflected across all connected users.
- 💬 Live Chat — Built-in messaging panel for seamless communication.
- 👥 Multi-User Rooms — Join with a room ID and see who's online.
- 🧑‍💻 Typing Indicators — Know when someone is actively coding.
- 📁 File Switching — Toggle between multiple files with dynamic extensions based on selected language.
- 🌐 Language Support — Choose between JavaScript, Python, Java, and C++.
- 📦 Modular Architecture — Clean separation of components for scalability and maintainability.

🛠️ Tech Stack
Frontend - React + Tailwind, Monaco Editor
Backend  - Node.js + Express
Real-Time - Socket.IO



📦 Installation
# Clone the repo
git clone https://github.com/your-username/coderoom.git
cd coderoom

# Install dependencies
npm install

# Start the client
npm start

# In a separate terminal, start the server
cd server
npm install
node index.js


Make sure your server is running on http://localhost:5000 or update the socket endpoint accordingly.


🧪 Usage
- Start the server and client.
- Enter a Room ID and Username to join.
- Collaborate with others in real-time.
- Switch languages to update file extensions dynamically (e.g., main.js → main.py).
- Use the chat panel to communicate.
