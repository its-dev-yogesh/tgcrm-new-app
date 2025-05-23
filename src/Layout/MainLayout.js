import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import Sidebar from "../Components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
function MainLayout() {
  return (
    <div>
      <div className="fixed w-full">
        <Navbar />
      </div>
      <div className="fixed w-full mt-16">
        <div>
          <Sidebar />
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
