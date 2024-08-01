import React from "react";
import { Route, Routes } from "react-router-dom";
import ForgotPassword from "../authentication/ForgotPassword";
import Login from "../authentication/Login";
import SignUp from "../authentication/SignUp";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="forgotpassword" element={<ForgotPassword />} />
    </Routes>
  );
};

export default AuthRoutes;
