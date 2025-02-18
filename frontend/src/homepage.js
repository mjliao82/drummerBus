import React from 'react';
import { useEffect } from 'react';
import './homepage.css'; 
import { Link } from 'react-router-dom'; 

function Homepage() {
  return (
    <div className="homepage-container">
      <img 
        src="/image/drummerDesktop.jpg" 
        alt="Drummer" 
        className="image-display"  
      />
      <div className="button-container">
        <Link to="/login">
          <button className="login-button">Log In</button>
        </Link>
        <Link to="/register">
          <button className='register-button'>Register Account</button>
        </Link>
        <Link to="/">
          <button className="booklessonbutton">Book a Lesson</button>
        </Link>
      </div>
    </div>
  );
}

export default Homepage;
