import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";

import { FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import { Table, DatePicker, Button, Divider, Tag, Tooltip } from "antd";
import { Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { TGCRMContext } from "../../Context/Context";

import SD from "../Tables/Source/SourceAnalytics/SD";
import MemberAnalyticsDashboard from "./MemberAnalyticsDashboard";
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
const { RangePicker } = DatePicker;

function DashboardContent() {
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
    LeadsData,
    CourseData,
    SourcesData,
  } = useContext(TGCRMContext);
  const [Users, setUsers] = useState([]);
  const [MemberFilterForm, setMemberFilterForm] = useState({
    name: "",
    gender: [],
    status: [],
    mobile: [],
    source: [],
    dob: "",
    role: [],
    course: [],
    date: [dayjs().format("DD-MM-YYYY"), dayjs().format("DD-MM-YYYY")],
    assigned_under: [],
    assigned_to: [],
    address: [],
  });
  const [PerformancetempData, setPerformancetempData] = useState([]);
  const [create_date_object, setcreate_date_object] = useState([]);
  const [Path, setPath] = useState("");
  const { pathname } = location;
  const [Status_count, setStatus_count] = useState({
    active: 0,
    followUps: 0,
    interested: 0,
  });
  const [Action_count, setAction_count] = useState({
    visited: 0,
    registered: 0,
    admitted: 0,
  });
  ////////UseEffects////////////////

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

  ///////////////////get Users/////////////////////
  useEffect(() => {
    // const result = calculateStatusCounts();
    // setTableData(result);
    // setUpdatedPerformanceArray(result);
    setPerformancetempData(PerformanceData);
    countFunction(LeadsData);
    if (AuthUser) {
      setUsers(memberData);
    }
  }, [getMember]);
  ///////////////////////////////////

  /////////////////Member Performance//////////////////////
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

  let options = Users.map((item) => ({
    value: item.full_name,
    label: item.full_name,
  }));

  /////////handleName
  const handleFullName = (select) => {
    const newData = { ...MemberFilterForm };
    newData.name = select;

    setMemberFilterForm(newData);
  };
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
  ///handle Date ////
  const handleDateCreated = (date, dateString) => {
    console.log("date Created", dateString);
    const newData = { ...MemberFilterForm };
    newData.date = dateString;
    setMemberFilterForm(newData);
    setcreate_date_object(date);
    console.log("date Created", dateString);
  };
  const handleFilter = () => {
    const lowercaseArray = convertArrayValuesToLowercase(filterLeads());
    countFunction(lowercaseArray);
    // const lead = convertArrayValuesToLowercase(filterLeads());
    countActionFunction(lowercaseArray);

    // console.log(lowercaseArray);
    // CPD = calculatePerformance(lowercaseArray);
    // calculateStatusCounts();
  };

  // let filtername = MemberFilterForm.map((item) => {
  //   return item.value;
  // });
  let filterRole = MemberFilterForm.role.map((item) => {
    return item.value;
  });
  let filtercourse = MemberFilterForm.course.map((item) => {
    return item.value;
  });
  let filtersource = MemberFilterForm.source.map((item) => {
    return item.value;
  });
  let filterstatus = MemberFilterForm.status.map((item) => {
    return item.value;
  });
  let filterPhone = MemberFilterForm.mobile.map((item) => {
    return item.value;
  });
  let filterassigned_under = MemberFilterForm.assigned_under.map((item) => {
    return item.value;
  });
  let filterassigned_to = MemberFilterForm.assigned_to.map((item) => {
    return item.value;
  });
  let filteraddress = MemberFilterForm.address.map((item) => {
    return item.value;
  });
  let filtergender = MemberFilterForm.gender.map((item) => {
    return item.value;
  });
  const filterAnanlytics = () => {
    return PerformancetempData.filter(
      (item) =>
        (!MemberFilterForm.name ||
          MemberFilterForm.name["value"] === item.staff_name) &&
        (!create_date_object ||
          dayjs(item.res_date, "DD-MM-YYYY").isBetween(
            dayjs(MemberFilterForm.date[0], "DD-MM-YYYY"),
            dayjs(MemberFilterForm.date[1], "DD-MM-YYYY"),
            "DD-MM-YYYY",
            "[]"
          ))
    );
  };
  const filterLeads = () => {
    return LeadsData.filter(
      (item) =>
        (!MemberFilterForm.name ||
          MemberFilterForm.name["value"] === item.assigned_to) &&
        (!create_date_object ||
          dayjs(item.modified_date, "DD-MM-YYYY").isBetween(
            dayjs(MemberFilterForm.date[0], "DD-MM-YYYY"),
            dayjs(MemberFilterForm.date[1], "DD-MM-YYYY"),
            "DD-MM-YYYY",
            "[]"
          ))
    );
  };
  const TopTitleTab = () => {
    return (
      <div className="w-12/12  flex justify-between items-center bg-gray-200 rounded overflow-hidden shadow-lg m-4 p-2 ">
        <div className="font-bold text-xl pl-3">{Path}</div>
      </div>
    );
  };
  const TopFilterTab = () => {
    return (
      <div className="w-12/12  flex justify-between items-center bg-gray-200 rounded mb-2 shadow-lg p-2 ">
        {" "}
        <div className="font-bold text-lg pl-3 w-3/12">Member Performance</div>
        <div className="flex flex-row justify-end items-center mb-2 w-full flex-wrap">
          {/* /////////////NAME */}
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md w-4/12">
            <label className="text-white font-bold p-1 ">Name:</label>
            <Select
              onChange={handleFullName}
              value={MemberFilterForm.name}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  border: state.isFocused ? "none" : "none",
                  backgroundColor: "transparent",
                  height: "100%",
                }),
              }}
              className="rounded-r-md bg-white p1 w-7/12 font-bold pl-1 focus:outline-none "
              name="colors"
              options={[{ label: "All", value: "all" }, ...options]}
              classNamePrefix="select"
              isClearable
            />
          </div>
          {/* Date Created/// */}
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md w-4/12">
            <label htmlFor="date_created" className="text-white font-bold p-1 ">
              Date Created:
            </label>

            <RangePicker
              value={create_date_object}
              presets={rangePresets}
              format="DD-MM-YYYY"
              className="rounded-r-md pr-3  text-2xl bg-white p1 w-7/12 font-bold pl-1 focus:outline-none"
              onChange={handleDateCreated}
            />
          </div>
          {/* submit button */}
          <button
            onClick={handleFilter}
            className=" flex  flex-row justify-center bg-Primary w-24  hover:opacity-80 text-xl  text-white  mr-2 p-2  hover:border-Primary hover:border-opacity-80 rounded">
            <span>
              <FaCheck />
            </span>
          </button>
          {/* <button
            onClick={() => {
              console.log(Status_count);
            }}
            className=" flex  flex-row justify-center bg-Primary w-24  hover:opacity-80 text-xl  text-white  mr-2 p-2  hover:border-Primary hover:border-opacity-80 rounded"
          ></button> */}
        </div>
      </div>
    );
  };

  const Status_card = (props) => {
    return (
      <div className="flex flex-col w-60 bg-slate-100 shadow-md shadow-slate-700 rounded font">
        <div className="flex flex-row justify-between items-center gap-2 m-2 p-2 text-[1.5rem] border-b-2 border-black">
          {props.title.toUpperCase()}
          <Link
            to={"/admin/member-performance"}
            className=" hover:cursor-pointer hover:text-blue-500">
            <FaExternalLinkAlt size={15} />
          </Link>
        </div>
        <div className="flex flex-row justify-center items-center gap-2 m-2 p-2 text-[1.5rem] ">
          {props.value}
        </div>
      </div>
    );
  };
  // const Status_Graph_card = (props) => {
  //   return (
  //     <div className="flex flex-col w-[25rem] bg-slate-100 shadow-md shadow-slate-700 rounded font">
  //       <div className="flex flex-row justify-center m-2 p2 text-[1.5rem] border-b-2 border-black">
  //         {props.title}
  //       </div>
  //       <div className="flex flex-row justify-center m-2 p2 text-[1.5rem] border-b-1 border-black">
  //         200
  //       </div>
  //     </div>
  //   );
  // };

  /////////////////////////////////////

  //////////Source Analytics Graph//////////////////////
  const getSourceAnalyticsByCourses = () => {
    const conclusion = {};

    // Iterate over the source data
    SourcesData.forEach((source) => {
      // Initialize an empty array for the source if not already present in the conclusion
      if (!conclusion[source.name]) {
        conclusion[source.name] = [];
      }

      // Iterate over the course data
      CourseData.forEach((course) => {
        // Filter lead data based on the current source and course
        const filteredLeads = LeadsData.filter(
          (lead) => lead.source === source.name && lead.course === course.name
        );

        // Calculate the counts based on the filtered leads
        const total_leads = filteredLeads.length;
        const total_active = filteredLeads.filter((lead) =>
          StatusData.some(
            (status) =>
              status.name === lead.status && status.admin_count === "yes"
          )
        ).length;
        const total_followUps = filteredLeads.filter((lead) =>
          StatusData.some(
            (status) =>
              status.name === lead.status && status.followup_count === "yes"
          )
        ).length;
        const totalInterested = filteredLeads.filter(
          (lead) => lead.status === "interested"
        ).length;

        // Add the calculated counts to the conclusion array for the current source
        conclusion[source.name].push({
          name: course.name,
          total_leads,
          total_active,
          total_followUps,
          totalInterested,
        });
      });
    });

    return conclusion;
  };
  const countFunction = (PT) => {
    const NS = { ...Status_count };
    NS.active = 0;
    NS.followUps = 0;
    NS.interested = 0;
    PT.forEach((performance) => {
      const { assigned_to, status } = performance;

      // Find the matching status object with admin_count set to "yes"
      const activecount = StatusData.find(
        (status_item) =>
          status_item.name.toLowerCase() === status.toLowerCase() &&
          status_item.admin_count === "yes"
      );
      const followcount = StatusData.find(
        (status_item) =>
          status_item.name.toLowerCase() === status.toLowerCase() &&
          status_item.followup_count === "yes"
      );

      if (activecount) {
        // Increment the Active count
        NS.active += 1;
      }
      if (followcount) {
        // Increment the Active count
        NS.followUps += 1;
      }
      if (status.toLowerCase() === "interested") {
        // Increment the Active count
        NS.interested += 1;
      }
    });
    setStatus_count(NS);

    console.log(NS);
  };
  const getSourceAnalyticsConcusionByCourses = getSourceAnalyticsByCourses();

  const countActionFunction = (Lead) => {
    let conclusion = { ...Action_count };
    conclusion.admitted = 0;
    conclusion.registered = 0;
    conclusion.visited = 0;

    let admitted_count = Lead.filter((item) => {
      return item.action === "admitted";
    }).length;
    let visited_count = Lead.filter((item) => {
      return item.action === "visited";
    }).length;
    let registered_count = Lead.filter((item) => {
      return item.action === "registered";
    }).length;
    conclusion.admitted = admitted_count;
    conclusion.visited = visited_count;
    conclusion.registered = registered_count;
    setAction_count(conclusion);
    return conclusion;
  };

  function generateColors(length) {
    const colors = [];
    const hueStep = Math.floor(360 / length);

    for (let i = 0; i < length; i++) {
      const hue = i * hueStep;
      const color = `hsl(${hue}, 70%, 50%)`;
      colors.push(color);
    }

    return colors;
  }
  const COLORS = generateColors(CourseData.length);
  const renderLegend = () => {
    const legendItems = Object.entries(
      getSourceAnalyticsConcusionByCourses
    ).map(([source, courses], index) => {
      return (
        <span key={source} style={{ marginRight: "10px" }}>
          <span
            style={{
              backgroundColor: COLORS[index % COLORS.length],
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
            }}></span>
          {" " + source}
        </span>
      );
    });

    return (
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {legendItems}
      </div>
    );
  };

  const renderTooltipContent = ({ payload }) => {
    if (payload && payload.length > 0) {
      const {
        name,
        total_leads,
        total_active,
        total_followUps,
        totalInterested,
      } = payload[0].payload;

      return (
        <div className="flex flex-col bg-white/60 backdrop-blur-sm font-bold border rounded shadow-md shadow-slate-600">
          <div className="flex items-center justify-center border-b-2 p-2">
            {name}
          </div>
          <div className="flex flex-col gap-1  justify-center border-b-2 p-3 font-bold">
            <p>Total Leads: {total_leads}</p>
            <p>Total Active: {total_active}</p>
            <p>Total Follow-ups: {total_followUps}</p>
            <p>Total Interested: {totalInterested}</p>
          </div>
        </div>
      );
    }

    return null;
  };
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,

    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    let textAnchor;
    if (Math.cos(-midAngle * RADIAN) >= 0) {
      // Right side of the pie chart
      textAnchor = "start";
    } else {
      // Left side of the pie chart
      textAnchor = "end";
    }

    return (
      <text
        className="text-white"
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={textAnchor}
        dominantBaseline="central">
        {CourseData[index].name}
      </text>
    );
  };
  return (
    <div className="w-12/12 ">
      <TopTitleTab />

      <div className="w-12/12 gap-2  flex-col justify-between flex-wrap items-center   m-4 my-8">
        <TopFilterTab />
        <div className="flex w-full gap-2 flex-row justify-between  flex-wrap items-center my-8 overflow-hidden">
          {Object.entries(Status_count).map(([key, value]) => (
            <Status_card title={key} value={value} />
          ))}
          {Object.entries(Action_count).map(([key, value]) => (
            <Status_card title={key} value={value} />
          ))}
          {/* <Status_card title="FollowUp" />
          <Status_card title="Interested" />
          <Status_card title="Visited" />
          <Status_card title="Registered" />
          <Status_card title="Admitted" /> */}
        </div>
      </div>
      <div className="w-12/12 gap-2  flex-col justify-between flex-wrap items-center   m-4 my-8">
        <Divider style={{ height: "0.1rem", backgroundColor: "white" }} />
      </div>
      <div className="w-12/12 gap-2  flex-col justify-between flex-wrap items-center   m-4 my-8">
        <SD />
      </div>
    </div>
  );
}

export default DashboardContent;
