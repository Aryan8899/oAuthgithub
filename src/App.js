import React from "react";

const GITHUB_CLIENT_ID = "Ov23liXyKSqeBCfJWEZm"; // Replace with your actual GitHub Client ID
const REDIRECT_URI = "http://localhost:3000/callback"; // Your callback URL, it should match with GitHub

const App = () => {
  const connectGithub = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;
    window.location.href = githubAuthUrl;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>PR Review System</h1>
      <button onClick={connectGithub} style={buttonStyle}>
        Connect to GitHub
      </button>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#24292e",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "5px",
};

export default App;
