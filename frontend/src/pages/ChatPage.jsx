import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatPage = () => {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        fetchMessages();

        socket.on("receiveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/messages/yourUserId/${userId}`);
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = () => {
        if (!text.trim()) return;

        const newMessage = {
            sender: "yourUserId",
            receiver: userId,
            text,
        };

        socket.emit("sendMessage", newMessage);
        setMessages([...messages, newMessage]); // Optimistic UI update
        setText("");
    };

    return (
        <div className="chat-container">
            <h2>Chat</h2>
            <div className="messages">
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.sender === "yourUserId" ? "You" : "Other"}:</strong> {msg.text}
                    </p>
                ))}
            </div>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatPage;
