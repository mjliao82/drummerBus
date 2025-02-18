import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Register.css';


const Register = () => {
    console.log("✅ Register.js: Component is rendering!");
    useEffect(() => {
        console.log("Register component moutned!!!")
    }, []);
    const URL = 'http://localhost:5001';

    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [registerError, setRegisterError] = useState('');

    const navigate = useNavigate();
    
    const handleRegister = async(e) => {
        e.preventDefault();

        const {username, password, email} = registerData;
        
        if (!username || !password || !email) {
            setRegisterError("All fields are required.");
            return;
        }

        try {
            const response = await fetch(`${URL}/auth/register`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(registerData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Registration failed.");
            }
            setRegisterError('');
            alert(data.message); // change this from alert
        } catch(error) {
            setRegisterError(error.message);
        }
    };
    return (
        <div className="register-container">
            <img 
            src="/image/drummerDesktop.jpg" 
            alt="Drummer" 
            className="image-display"
            />
            <div className="register-form">
                <h1>IQVentory - Drummer Bus</h1>
                <div className="register-card">
                    <h2>Register Here</h2>
                    <form className="register-form" onSubmit={handleRegister}>
                        <input
                            className="input"
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={registerData.username}
                            onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                            required                            
                        />
                        <input
                            className="input"
                            type="text"
                            name="password"
                            placeholder="Password"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                            required                            
                        />
                        <input
                            className="input"
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                            required
                        />
                        <Link to="/">
                            <button className="register-button">
                                Register
                            </button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;