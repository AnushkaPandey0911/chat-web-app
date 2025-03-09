import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/users");
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const startChat = (userId) => {
        if (userId !== currentUserId) {
            navigate(`/chat/${userId}`);
        } else {
            alert("You cannot chat with yourself!");
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Welcome to the Chat App</h2>
            <h3>Users:</h3>
            <ul>
                {users.map((user) => (
                    <li key={user._id} onClick={() => startChat(user._id)}>
                        {user.username} {user._id === currentUserId ? "(You)" : "🟢"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
