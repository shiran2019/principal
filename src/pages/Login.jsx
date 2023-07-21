import React, { useState, useContext } from "react";
import axios from "axios";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import NavigationBar from "../components/Navbar";
import { AuthContext } from "../helpers/AuthContext";
import "./Login.css"; 

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  const navigate = useNavigate();

  const login = () => {
    const data = { user: username, password: password };
    axios.post("http://localhost:3001/users/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
        localStorage.setItem("accessToken", "");
      } else {
        localStorage.setItem("accessToken", response.data);
        setAuthState(true);

        window.location = "/";
      }
    });
  };



  
  return (
    <>
    <div className="App">
        <NavigationBar />
      </div>
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <button onClick={login}>Login</button>
    </div>
    </>
  );
}


export default Login;
