import React from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";

import Navbar from "../../Components/Navbar/Navbar";

import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex flex-col h-screen">
      <div className="fixed top-0 left-0 w-full z-10">
        <Navbar />
      </div>
      <div className=" flex w-full bg-slate-400 overflow-hidden">
        <div className="relative top-16 left-0 h-full">
          <Sidebar />
        </div>
        <div className="w-full mt-16 ml-sidebar overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
