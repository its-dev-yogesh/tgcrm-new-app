import React, { useContext, useEffect, useState } from "react";
import { TGCRMContext } from "../../../../Context/Context";
import { Table, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import Select from "react-select";
import { FaCheck } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { CSVLink } from "react-csv";
import MemberAnalyticsRealtime from "./MemberAnalyticsRealtime";
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
const { RangePicker } = DatePicker;
const MemberAnalytics = () => {
  const location = useLocation();
  const {
    getPerformance,
    PerformanceData,
    getStatus,
    StatusData,
    getMember,
    memberData,
    AuthUser,
    getLeads,
  } = useContext(TGCRMContext);
  const [Users, setUsers] = useState([]);
  const [updatedPerformanceArray, setUpdatedPerformanceArray] = useState([]);
  const [FormData, setFormData] = useState({
    full_name: [],
    gender: [],
    email: [],
    phone_no: [],
    fathers_name: [],
    dob: "",
    role: [],
    branch_position: [],
    date_created: [dayjs().format("DD-MM-YYYY"), dayjs().format("DD-MM-YYYY")],
    assigned_under: [],
    assigned_by: [],
    address: [],
  }); // eslint-disable-next-line
  const [create_date_object, setcreate_date_object] = useState([]);
  const [OpenFilter, setOpenFilter] = useState(false);
  const [TableData, setTableData] = useState([]);
  const [Path, setPath] = useState("");
  const { pathname } = location;
  useEffect(() => {
    const get_location = () => {
      let p_name = pathname.split("/");
      console.log(p_name);
      if (p_name.length > 2) {
        setPath(p_name[2].toUpperCase());
      } else {
        setPath(p_name[1].toUpperCase());
      }
    };
    get_location();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    const result = calculateStatusCounts();
    setTableData(result);
    setUpdatedPerformanceArray(result);
    if (AuthUser) {
      setUsers(memberData);
    }
  }, [getMember]);


  const [statusCount, setStatusCount] = useState({
    active: 0,
    followUp: 0,
    interested: 0,
  });
  const rangePresets = [
    {
      label: "This Week",
      value: [dayjs().day(0), dayjs()],
    },
    {
      label: "Last Week",
      value: [dayjs().day(0).add(-1, "w"), dayjs().day(-1)],
    },
    {
      label: "This Month",
      value: [dayjs().date(1), dayjs()],
    },
    {
      label: "Last Month",
      value: [dayjs().date(1).add(-1, "M"), dayjs().date(0)],
    },
  ];
  const calculatePerformance = (data) => {
    const performance = [];

    data.forEach((item) => {
      const existingStaff = performance.find(
        (staff) => staff.staff_name === item.staff_name
      );

      if (existingStaff) {
        existingStaff[item.lead_status] =
          (existingStaff[item.lead_status] || 0) + 1;
      } else {
        const newStaff = { staff_name: item.staff_name };
        newStaff[item.lead_status] = 1;
        performance.push(newStaff);
      }
    });

    return performance;
  };
  let filtername = FormData.full_name.map((item) => {
    return item.value;
  });
  // const filterTotalAssigned = () => {
  //   return AuthUser.assigned_info.filter(
  //     (item) =>
  // !Analyticsdate_object ||
  // dayjs(item.assign_date, "DD-MM-YYYY").isBetween(
  //   dayjs(analyticsDateFilter[0], "DD-MM-YYYY"),
  //   dayjs(analyticsDateFilter[1], "DD-MM-YYYY"),
  //   "DD-MM-YYYY",
  //   "[]"
  // )
  //   );
  // };
  const filterMembers = () => {
    return PerformanceData.filter(
      (item) =>
        (!filtername.length > 0 || filtername.includes(item.staff_name)) &&
        (!create_date_object ||
          dayjs(item.res_date, "DD-MM-YYYY").isBetween(
            dayjs(FormData.date_created[0], "DD-MM-YYYY"),
            dayjs(FormData.date_created[1], "DD-MM-YYYY"),
            "DD-MM-YYYY",
            "[]"
          ))
    );
  };
  let CPD = calculatePerformance(filterMembers());
  const handleFilter = () => {
    const lowercaseArray = convertArrayValuesToLowercase(filterMembers());
    CPD = calculatePerformance(lowercaseArray);
    calculateStatusCounts();
  };

  const calculateStatusCounts = () => {
    const updatedPerformanceArray = CPD.map((performance) => {
      let activeCount = 0;
      let followupCount = 0;
      let total_Acount = 0;
      let date = [];
      Object.entries(performance).forEach(([key, value]) => {
        if (key !== "staff_name") {
          const status = StatusData.find((status) => status.name === key);
          if (status) {
            if (status.admin_count === "yes") {
              activeCount += value;
            }
            if (status.followup_count === "yes") {
              followupCount += value;
            }
          }
        }

        // total_Acount = Assigned_count.assigned_info.length;
      });
      const Assigned_count = memberData.filter(
        (user) => user.full_name === performance.staff_name
      );
      if (Assigned_count[0]) {
        const filterDateforAssign = Assigned_count[0].assigned_info.filter(
          (lead) => {
            return (
              !create_date_object ||
              dayjs(lead.assign_date, "DD-MM-YYYY").isBetween(
                dayjs(FormData.date_created[0], "DD-MM-YYYY"),
                dayjs(FormData.date_created[1], "DD-MM-YYYY"),
                "DD-MM-YYYY",
                "[]"
              )
            );
          }
        );
        total_Acount = filterDateforAssign.length;
        console.log(
          "🙏 ~ file: MemberAnalytics.js:185 ~ updatedPerformanceArray ~ total_Acount:",
          Assigned_count
        );
      }

      return {
        ...performance,
        active: activeCount,
        followup: followupCount,
        total_Assigned: total_Acount,
        date: FormData.date_created,
      };
    });
    console.log(updatedPerformanceArray);
    setTableData(updatedPerformanceArray);
    return updatedPerformanceArray;
  };
  function toCamelCase(str) {
    // Remove leading/trailing spaces and convert to lowercase
    str = str.trim().toLowerCase();

    // Split the string into words
    const words = str.split(" ");

    // Capitalize the first letter of each word (except the first word)
    const camelCaseWords = words.map((word, index) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    // Join the words together
    const camelCaseStr = camelCaseWords.join(" ");

    return camelCaseStr;
  }
  let status_data = StatusData.map((item) => ({
    title: <span className="font-bold">{item.name}</span>,
    dataIndex: item.name,
  }));
  let Export_status_data = StatusData.map((item) => ({
    title: item.name,
    key: item.name,
  }));

  const columns = [
    {
      title: <span className="font-bold">Staff Name</span>,
      dataIndex: "staff_name",
      editable: true,
      render: (_, record) => (
        <span className="     font-bold">{toCamelCase(record.staff_name)}</span>
      ),
      fixed: "left",
    },
    {
      title: <span className="font-bold">Total Assigned</span>,
      dataIndex: "total_Assigned",
      editable: true,
    },
    {
      title: <span className="font-bold">Active</span>,
      dataIndex: "active",

      editable: true,
    },
    {
      title: <span className="font-bold">Followup</span>,
      dataIndex: "followup",

      editable: true,
    },
    ...status_data,
  ];
  const headers = [
    { label: "Name", key: "staff_name" },
    { label: "Assigned", key: "total_Assigned" },
    { label: "Active", key: "active" },
    { label: "Follow Up", key: "followup" },
    ...StatusData.map((item) => ({ label: item.name, key: item.name })),
    { label: "date", key: "date" },
    // { label: "action", key: "action" },
    // { label: "comment", key: "comment" },
  ];
  function convertArrayValuesToLowercase(arr) {
    const lowercaseArr = arr.map((obj) => {
      const lowercaseObj = Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = typeof value === "string" ? value.toLowerCase() : value;
        return acc;
      }, {});
      return lowercaseObj;
    });

    return lowercaseArr;
  }

  ///////////////handle filter toggle /////////////
  const handlefilterToggle = () => {
    setOpenFilter(!OpenFilter);
  };
  // handle Reset
  const handleReset = () => {
    const newData = {
      full_name: [],
      gender: [],
      email: [],
      phone_no: [],
      fathers_name: [],
      dob: "",
      role: [],
      branch_position: [],
      date_created: [],
      assigned_under: [],
      assigned_by: [],
      address: [],
    };
    setcreate_date_object([]);
    setFormData(newData);
  };
  /////////handleName
  const handleFullName = (select) => {
    const newData = { ...FormData };
    newData.full_name = select;

    setFormData(newData);
  };
  ///handle Date ////
  const handleDateCreated = (date, dateString) => {
    console.log("date Created", dateString);
    const newData = { ...FormData };
    newData.date_created = dateString;
    setFormData(newData);
    setcreate_date_object(date);
    console.log("date Created", dateString);
  };
  const options = Users.map((item) => ({
    value: item.full_name,
    label: item.full_name,
  }));

  const FilterTab = () => {
    return (
      <div className="w-12/12  bg-gray-200 rounded  shadow-lg m-4 ">
        <div className=" flex flex-row justify-between px-6 py-4">
          <div className="font-bold text-xl mb-2">Daily Reports </div>
          <div>
            <button
              onClick={handlefilterToggle}
              className="bg-Primary w-20 hover:opacity-50 text-sm  text-white font-bold  mr-2 py-2 px-4 border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded">
              {OpenFilter ? <span>X</span> : <span>Filter</span>}
            </button>

            <button
              onClick={handleReset}
              className="bg-Primary hover:opacity-50 text-sm  text-white font-bold  py-2 px-4 border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded">
              Reset
            </button>
          </div>
        </div>
        {OpenFilter && (
          <div className={`bg-white flex flex-col p-2 mb-5 w-full `}>
            <div className="font-bold text-xl m-2 ">
              <span>Member Filter :</span>
            </div>

            <div className="flex flex-row justify-between mb-2 w-full flex-wrap">
              <div className="  flex flex-col justify-between flex-grow ">
                {/* /////////////NAME */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Name:</label>
                  <Select
                    onChange={handleFullName}
                    value={FormData.full_name}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        border: state.isFocused ? "none" : "none",
                        backgroundColor: "transparent",
                        height: "100%",
                      }),
                    }}
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none "
                    isMulti
                    name="colors"
                    options={options}
                    classNamePrefix="select"
                  />
                </div>
              </div>
              <div className="  flex flex-col justify-between flex-grow">
                {/* Date Created/// */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label
                    htmlFor="date_created"
                    className="text-white font-bold p-1">
                    Date Created:
                  </label>

                  <RangePicker
                    value={create_date_object}
                    presets={rangePresets}
                    format="DD-MM-YYYY"
                    className="rounded-r-md pr-3  text-2xl bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none"
                    onChange={handleDateCreated}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center">
              <div>
                <button
                  onClick={handleFilter}
                  className=" flex  flex-row justify-center bg-Primary w-24  hover:opacity-80 text-xl  text-white  mr-2 p-2  hover:border-Primary hover:border-opacity-80 rounded">
                  <span>
                    <FaCheck />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-12/12 ">
      {" "}
      <MemberAnalyticsRealtime />
      <FilterTab />
      <div className="w-12/12 bg-gray-200 rounded overflow-auto shadow-lg m-4 p-2 ">
        <div className="flex justify-between items-center p-4">
          {/* <button onClick={handleFilter}>click</button> */}
        </div>
        <Button className="shadow-black bg-slate-400 mb-2 text-white font-bold">
          <CSVLink data={TableData} headers={headers}>
            Export to CSV
          </CSVLink>
        </Button>
        <div className="w-12/12">
          <Table
            bordered
            dataSource={TableData}
            columns={columns}
            rowClassName="editable-row"
            scroll={{ x: "calc(700px + 50%)" }}
          />
        </div>
      </div>
    </div>
  );
};

export default MemberAnalytics;
