// // import React, { useEffect, useState } from "react";
// // import { Routes, Route, useNavigate } from "react-router-dom";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import ChatPage from "./pages/ChatPage";
// import Chat from "./pages/Chat";

// const Dashboard = () => {
//     const [users, setUsers] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             const response = await fetch("http://localhost:5000/api/users");
//             const data = await response.json();
//             setUsers(data);
//         } catch (error) {
//             console.error("Error fetching users:", error);
//         }
//     };

//     const startChat = (userId) => {
//         navigate(`/chat/${userId}`);
//     };

//     return (
//         <div className="dashboard-container">
//             <h2>Welcome to the Chat App</h2>
//             <h3>Users:</h3>
//             <ul>
//                 {users.map((user) => (
//                     <li key={user._id} onClick={() => startChat(user._id)}>
//                         {user.username} 🟢
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// function App() {
//     return (
//         <BrowserRouter>
//             <Routes>
//                 <Route path="/" element={<Login />} />
//                 <Route path="/signup" element={<Signup />} />
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/chat/:userId" element={<Chat />} /> {/* Chat Route */}
//             </Routes>
//         </BrowserRouter>
//     );
// }

// export default App;


import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";  // Make sure the path is correct

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat/:userId" element={<Chat />} /> {/* Chat Route */}
        </Routes>
    );
}

export default App;
