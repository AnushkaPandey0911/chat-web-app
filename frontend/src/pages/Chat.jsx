import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const Chat = () => {
    const { userId } = useParams(); // Receiver's user ID
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const senderId = localStorage.getItem("userId");
    console.log("✅ senderId:", senderId);
if (!senderId) {
    console.error("❌ senderId is missing! Please log in again.");
} else {
    console.log("✅ senderId:", senderId);
}


    useEffect(() => {
        if (!senderId) {
            console.error("Sender ID missing. Please log in.");
            return;
        }

        // Join room
        socket.emit("join_room", senderId);

        // Fetch messages from backend
        const fetchMessages = async () => {
            if (!senderId) {
              console.error("❌ senderId is undefined. Cannot fetch messages.");
              return;
            }
          
            try {
              const response = await axios.get(
                `http://localhost:5000/api/messages/${senderId}/${receiverId}`
              );
              console.log("✅ Messages:", response.data);
            } catch (error) {
              console.error("❌ Error fetching messages:", error);
            }
          };
          
        fetchMessages();

        // Listen for incoming messages
        socket.on("receive_message", (message) => {
            console.log("📩 New message received:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, [userId, senderId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        if (!senderId || !userId) {
            console.error("❌ Missing senderId or userId. Cannot send message.");
            return;
        }
    
        const messageData = {
            sender: senderId,
            receiver: userId,
            text: newMessage
        };
    
        try {
            await axios.post("http://localhost:5000/api/messages", messageData);
            socket.emit("send_message", messageData);
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setNewMessage("");
        } catch (error) {
            console.error("❌ Error sending message:", error.response?.data || error.message);
        }
    };
    

    return (
        <div className="chat-container">
            <h2>Chat with User {userId}</h2>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === senderId ? "sent" : "received"}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
