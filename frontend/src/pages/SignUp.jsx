import React from "react";
import "./signup.css";

const SignUp = () => {
  return (
    <div className="signup-universe flex items-center justify-center px-4">

      {/* Shooting stars */}
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>

      {/* Signup Card */}
      <div className="signup-card">
              {/* Moving bottom ticker */}
      <div className="signup-ticker">
        <div className="ticker-text">
          🚀 Let's turn your ideas into epic wins • Join XPECTO26 at IIT Mandi 🌌
        </div>
      </div>
      {/* Second bottom ticker */}
<div className="signup-ticker second-ticker">
  <div className="ticker-text">
    🔐 Sign in to experience XPECTO26 • Sign in to register for events
  </div>
</div>


        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          Fill the required fields
        </h1>

        {/* Phone Number */}
        <input
          type="tel"
          placeholder="Your phone number"
          className="mb-4"
        />

        {/* First Name */}
        <input
          type="text"
          placeholder="First name"
          className="mb-4"
        />

        {/* Last Name */}
        <input
          type="text"
          placeholder="Last name"
          className="mb-4"
        />

        {/* Institute Email */}
        <input
          type="email"
          placeholder="Institute email ID"
          className="mb-4"
        />

        {/* Competition */}
        <select className="mb-4">
          <option value=""> Other options to sign in </option>
          <option>SIgn in with Google</option>
          <option>Sign in with Git Hub</option>
        </select>

        <button>Next</button>
      </div>
    </div>
  );
};

export default SignUp;


