# 🧑‍💻 Real-Time Code Editor

A collaborative **real-time code editor** that allows multiple users to join a room, write and edit code together instantly — powered by **WebSockets**, **Node.js**, and **React**.

---

## 🚀 Live Demo
🔗 **[real-time-editor-one.vercel.app](https://real-time-editor-one.vercel.app/)**

- **Frontend:** Deployed on [Vercel](https://vercel.com)
- **Backend:** Deployed on [Render](https://render.com)

---

## 📸 Preview

### 🪪 Join Room Page
![Join Room](./realtimeeditor.png)

### 💻 Collaborative Code Editor
![Code Editor](./rte.png)

---

## ✨ Features

- ⚡ Real-time collaboration using **Socket.io**
- 👥 Multiple users editing simultaneously
- 🧠 Unique room ID generation
- 💻 Syntax-highlighted editor
- 👀 Live member list with active users
- 🎨 Minimal and responsive UI

---

## 🏗️ Tech Stack

### **Frontend**
- React (Vite)
- Socket.io-client
- Tailwind CSS
- ShadCN UI Components

### **Backend**
- Node.js
- Express
- Socket.io
- Typescript

---

## 📁 Folder Structure

real-time-editor/
│
├── backend/ # Express + Socket.io server
│ ├── package.json
│ └── index.js
│
├── frontend/ # React + Vite frontend
│ ├── package.json
│ └── src/
│ ├── components/
│ ├── pages/
│ └── App.jsx
│
└── README.md

## 🧩 How It Works

1. A user enters their **username** and either **creates** or **joins** a room.
2. The frontend connects to the backend WebSocket server.
3. All code changes are broadcasted to all connected clients in the same room.
4. Users see live updates and active member lists in real-time.
