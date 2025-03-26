import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import ManageAppointments from "./pages/ManageAppointments";
import ViewAppointments from "./pages/ViewAppointments";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import Profile from "./pages/Profile";


const App = () => {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element= {<Signup />} />
        <Route path="/reset" element= {<PasswordReset/>} />
        <Route path="/home/:adminId" element={<Layout />} >
          <Route path="profile" element={<Profile/>} />
          <Route path="appointment-form" element={<ManageAppointments />} />
          <Route path="view-appointments" element={<ViewAppointments />} />
        </Route>
      </Routes>
    </BrowserRouter>
      
      
    </div>
  );
};

export default App;
