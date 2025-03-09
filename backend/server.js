const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const User = require("./models/User");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Create HTTP server
const server = http.createServer(app);

// WebSocket Setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`🔗 User connected: ${socket.id}`);

    // Join room based on user ID (assumes frontend sends userId)
    socket.on("join_room", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
    });

    // Listen for sending messages
    socket.on("send_message", async (data) => {
        try {
            const { sender, receiver, text } = data;

            if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
                console.error("Invalid sender or receiver ID");
                return;
            }

            const newMessage = new Message({ sender, receiver, text });
            await newMessage.save();
            console.log("✅ Message saved:", newMessage);

            // Emit message to sender and receiver rooms
            io.to(sender).to(receiver).emit("receive_message", newMessage);
        } catch (error) {
            console.error("❌ Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("Chat API is running..."));

// Fetch all users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({}, "username _id");
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get chat history between two users
app.get("/api/messages/:senderId/:receiverId", async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }
        const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error("❌ Error fetching messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Send a new message (API route)
app.post("/api/messages", async (req, res) => {
    const { sender, receiver, text } = req.body;

    if (!sender || !receiver || !text) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const newMessage = new Message({ sender, receiver, text });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("❌ Error saving message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




// Start the server
server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
