import React, { useContext, useState } from "react";
import Logo from "../../Assets/Images/Logo.png";
import { TGCRMContext } from "../../Context/Context";
import { Link, useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  const { getLeads, memberData, AuthUser } = useContext(TGCRMContext);
  const [profile_DD, setprofile_DD] = useState(false);
  return (
    <div>
      <nav className="bg-white  border-gray-200 dark:bg-Secondary">
        <div className="w-full flex flex-wrap items-center justify-between  p-4">
          <a href="/" className="flex items-center">
            <img src={Logo} className="h-8 mr-3" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              TGCRM
            </span>
          </a>
          <div className="flex items-center md:order-2">
            <button
              type="button"
              className="flex mr-3 justify-center align-middle text-center text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
              onClick={() => {
                setprofile_DD(!profile_DD);
              }}
            >
              <span className="text-lg text-white font-bold pl-3 pr-3 flex align-middle justify-center">
                {AuthUser.full_name}
              </span>
              <img className="w-8 h-8 rounded-full" src={Logo} alt="user" />
            </button>
          </div>
        </div>
      </nav>
      {/* DropDown */}
      {profile_DD === true && (
        <div
          className="z-50 absolute right-3 my-1 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
          id="user-dropdown"
        >
          <div className="px-4 py-3">
            <span className="block text-sm text-gray-900 dark:text-white">
              {AuthUser.full_name}
            </span>
            <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
              {AuthUser.email}
            </span>
          </div>
          <ul className="py-2" aria-labelledby="user-menu-button">
            <li>
              <a
                href="/"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Dashboard
              </a>
            </li>

            <li>
              <Link
                onClick={() => {
                  window.localStorage.removeItem("token_id");
                  window.location.href = "./";
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
