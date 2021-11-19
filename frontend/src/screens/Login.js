import React from "react";
import Footer from "../components/Footer";
import LoginForm from "../components/login/LoginForm";
import Navbar from "../components/Navbar";
const Login = () => {
  return (
    <div style={{ display: "grid", gridTemplateRows: "auto 1fr auto", minHeight:"100vh"}}>
      <Navbar />
      <LoginForm />
      <Footer />
    </div>
  );
};

export default Login;
