import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import PasswordReset from "./Components/PasswordReset/PasswordReset";
import AppointmentForm from "./pages/AppointForm";
import ViewAppointments from "./pages/ViewAppointments";
import Layout from "./layout/Layout";



const App = () => {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element= {<Signup />} />
        <Route path="/reset" element= {<PasswordReset/>} />
        <Route path="/home/:userId" element={<Layout />} >
          <Route path="appointment-form" element={<AppointmentForm />} />
          <Route path="view-appointments" element={<ViewAppointments />} />
        </Route>
      </Routes>
    </BrowserRouter>
      
      
    </div>
  );
};

export default App;
