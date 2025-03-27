import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="bg-white">
        <div className="fixed"><Sidebar /></div>
      <div className="flex flex-col">
      <div className="sticky top-0 shadow-sm h-[8.5vh]"><Navbar /></div>
        <main className="flex-1 ml-[40vh]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
