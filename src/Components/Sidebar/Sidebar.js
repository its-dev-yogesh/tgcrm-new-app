import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import {
  MdAnalytics,
  MdDashboard,
  MdGroup,
  MdLeaderboard,
  MdLibraryBooks,
  MdOutlineLibraryBooks,
  MdSettings,
  MdSource,
} from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import {} from "react-icons/md";

import { FaChalkboardTeacher, FaChild, FaLeaf, FaStar } from "react-icons/fa";
// import Link from "react-dom";

const Sidebar = () => {
  const Navigate = useNavigate();
  const menus = [
    {
      name: "Dashboard",
      link: "dashboard",
      icon: MdDashboard,
    },
    {
      name: "Analytics",
      link: "analytics",
      icon: MdAnalytics,
      submenus: [
        {
          name: "Member Performance ",
          link: "member-performance",
          icon: FaChalkboardTeacher,
        },
        // {
        //   name: "Lead Analytics",
        //   link: "lead-analytics",
        //   icon: MdLeaderboard,
        // },
        {
          name: "Source Analytics ",
          link: "source-analytics",
          icon: MdSource,
        },
        // {
        //   name: "Course Analytics",
        //   link: "course-analytics",
        //   icon: MdOutlineLibraryBooks,
        // },
        // {
        //   name: "Status Analytics",
        //   link: "status-analytics",
        //   icon: FaStar,
        // },
      ],
    },
    {
      name: "Members",

      icon: MdGroup,
      submenus: [
        {
          name: "Members List",
          link: "members",
          icon: FaStar,
        },
        {
          name: "Add Member",
          link: "reg-members",
          icon: FaStar,
        },
      ],
    },
    {
      name: "Status",

      icon: FaStar,
      submenus: [
        {
          name: "Status List",
          link: "status",
          icon: FaStar,
        },
        {
          name: "Add Status",
          link: "reg-status",
          icon: FaStar,
        },
      ],
    },

    {
      name: "Source ",

      icon: MdSource,
      submenus: [
        {
          name: "Source List",
          link: "source",
          icon: FaStar,
        },
        {
          name: "Add Source",
          link: "reg-source",
          icon: FaStar,
        },
      ],
    },
    {
      name: "Course",

      icon: MdLibraryBooks,
      submenus: [
        {
          name: "Course List",
          link: "course",
          icon: FaStar,
        },
        {
          name: "Add Course",
          link: "reg-course",
          icon: FaStar,
        },
      ],
    },
    {
      name: "Leads",

      icon: FaChild,
      submenus: [
        {
          name: "Leads List",
          link: "leads",
          icon: FaStar,
        },
        {
          name: "Import Leads",
          link: "reg-leads",
          icon: FaStar,
        },
      ],
    },
    {
      name: "Calling",
      link: "calling",
      icon: MdDashboard,
    },
  ];
  const [menuOpen, setmenuOpen] = useState(true);
  const [SubmenuOpen, setSubmenuOpen] = useState("");
  const [isOpened, setisOpened] = useState(false);
  const handleMenu = (menu, link) => {
    if (menu?.submenus) {
      if (isOpened && SubmenuOpen === menu.name) {
        setisOpened(false);
      } else {
        setisOpened(true);
        setSubmenuOpen(menu.name);
      }
    } else {
      //   alert(JSON.stringify(menu));
      Navigate(link);
      setSubmenuOpen(menu.name);
    }
  };
  return (
    <section className="flex gap-1 bg-transparent">
      <div
        className={`bg-[#0e0e0e] min-h-screen ${
          menuOpen ? "w-72 lg:w-72" : "w-16"
        } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => {
              setSubmenuOpen("");
              setmenuOpen(!menuOpen);
            }}
          />
        </div>
        <div className="mt-4 flex flex-col gap-2 relative">
          {menus?.map((menu, i) => (
            <>
              <button
                onClick={() => {
                  handleMenu(menu, menu?.link);
                }}
                key={i}
                className={` ${
                  menu?.margin && "mt-5"
                } bg-gray-700 group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-Primary border-l-2 rounded-r`}
              >
                <div>{React.createElement(menu?.icon, { size: "20" })}</div>
                <h2
                  style={{
                    transitionDelay: `${i + 3}00ms`,
                  }}
                  className={`flex justify-between w-full whitespace-pre duration-500 ${
                    !menuOpen && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  {menu?.name}
                  {menu?.submenus && SubmenuOpen === menu.name ? (
                    <RiArrowDropDownLine />
                  ) : (
                    ""
                  )}
                </h2>
                <h2
                  className={`${
                    menuOpen && "hidden"
                  } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                >
                  {menu?.name}
                </h2>
              </button>
              <div
                className={`bg-slate-600 ml-4  border-l-2 ${
                  SubmenuOpen === menu.name && isOpened
                    ? "border-white "
                    : "border-none"
                } box-border `}
              >
                {menu?.submenus &&
                  SubmenuOpen &&
                  isOpened &&
                  menu?.submenus.map((item, index) => (
                    <Link
                      to={item?.link}
                      key={index}
                      className={`${
                        menu.name === SubmenuOpen ? "" : "hidden "
                      } w-full group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-Primary rounded-md`}
                    >
                      <div>
                        {React.createElement(item?.icon, { size: "20" })}
                      </div>
                      <h2
                        style={{
                          transitionDelay: `${i + 3}00ms`,
                        }}
                        className={`whitespace-pre duration-500 ${
                          !menuOpen &&
                          "opacity-0 translate-x-28 overflow-hidden"
                        }`}
                      >
                        {item?.name}
                      </h2>
                      <h2
                        className={`${
                          menuOpen && "hidden"
                        } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                      >
                        {item?.name}
                      </h2>

                      <h2
                        className={`${
                          menuOpen && "hidden"
                        } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                      >
                        {item?.name}
                      </h2>
                    </Link>
                  ))}{" "}
              </div>
            </>
          ))}
        </div>
      </div>
      {/* <div className="mt-3 ml-0 text-xl text-gray-900 font-semibold">
        DASHBOARD
      </div> */}
    </section>
  );
};

export default Sidebar;
