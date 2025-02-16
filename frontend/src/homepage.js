import React from 'react';
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
        <Link to ="/" className="button-link">
            <button className="loginbutton">Log In</button>
        </Link>
    </div>
  );
}

export default Homepage;
