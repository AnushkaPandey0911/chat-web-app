import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            alert("Signup successful! Redirecting to login...");
            navigate("/"); // Redirect to login page
        } else {
            alert("Signup failed. Please try again.");
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
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
            <button onClick={handleSignup}>Sign Up</button>

            {/* Link to Login */}
            <p>Already have an account? <span onClick={() => navigate("/")} style={{ color: "blue", cursor: "pointer" }}>Login</span></p>
        </div>
    );
};

export default Signup;
