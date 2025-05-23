import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

function UserInputLayout() {
  return (
    <div>
      <div className="fixed w-full">
        <Navbar />
      </div>
      <div className="fixed w-full mt-16">
        <Outlet />
      </div>
    </div>
  );
}

export default UserInputLayout;
