import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <div className="flex">
        <div className="fixed"><Sidebar /></div>
        <main className="flex-1 ml-[40vh]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
