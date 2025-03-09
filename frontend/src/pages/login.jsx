import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
    
        if (response.ok) {
            const data = await response.json(); // Get user data
            localStorage.setItem("userId", data._id); // Store user ID
            navigate("/dashboard"); // Redirect user to dashboard
        } else {
            alert("Invalid credentials, please try again.");
        }
    };
    

    return (
        <div className="login-container">
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            
            {/* Add Sign Up Option */}
            <p>Don't have an account? <span onClick={() => navigate("/signup")} style={{ color: "blue", cursor: "pointer" }}>Sign Up</span></p>
        </div>
    );
};

export default Login;
