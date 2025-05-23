import React, { useContext, useEffect, useState } from "react";
import { Table, DatePicker, Divider } from "antd";
import { FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import Select from "react-select";
import dayjs from "dayjs";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { TGCRMContext } from "../../../../Context/Context";
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
const { RangePicker } = DatePicker;
const SD = () => {
  const {
    LeadsData,
    StatusData,
    CourseData,
    SourcesData,
    memberData,
    getMember,
    AuthUser,
  } = useContext(TGCRMContext);
  const [FormData, setFormData] = useState({ name: [], date: [] });
  const [create_date_object, setcreate_date_object] = useState([]);
  const [
    getSourceAnalyticsConcusionByCourses,
    setgetSourceAnalyticsConcusionByCourses,
  ] = useState({});
  const [Users, setUsers] = useState([]);
  useEffect(() => {
    // const result = calculateStatusCounts();
    // setTableData(result);
    // setUpdatedPerformanceArray(result);
    const tempdata = getSourceAnalyticsByCourses();
    setgetSourceAnalyticsConcusionByCourses(tempdata);
    if (AuthUser) {
      setUsers(memberData);
    }
  }, [getMember]);
  /////////handleName
  const handleFullName = (select) => {
    const newData = { ...FormData };
    newData.name = select;

    setFormData(newData);
  };
  ///handle Date ////
  const handleDateCreated = (date, dateString) => {
    console.log("date Created", dateString);
    const newData = { ...FormData };
    newData.date = dateString;
    setFormData(newData);
    setcreate_date_object(date);
    console.log("date Created", dateString);
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
  const handleFilter = () => {
    const lowercaseArray = convertArrayValuesToLowercase(filterLeads());
    let SD = SourcesData.filter((source) => {
      return !filtername.length > 0 || filtername.includes(source.name);
    });
    getSourceAnalyticsByCourses(SD);
  };
  let filtername = FormData.name.map((item) => {
    return item.value;
  });
  const filterLeads = () => {
    return LeadsData.filter(
      (item) =>
        (!filtername.length > 0 || filtername.includes(item.source)) &&
        (!create_date_object ||
          dayjs(item.modified_date, "DD-MM-YYYY").isBetween(
            dayjs(FormData.date[0], "DD-MM-YYYY"),
            dayjs(FormData.date[1], "DD-MM-YYYY"),
            "DD-MM-YYYY",
            "[]"
          ))
    );
  };
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

  const options = SourcesData.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  let Graph_column = [
    {
      title: (
        <div className="text-[10px] md:text-[12px] lg:text-[14px]">
          Course name
        </div>
      ),
      dataIndex: "name",
    },
    {
      title: (
        <div className="text-[10px] md:text-[12px] lg:text-[14px]">
          Total Leads
        </div>
      ),
      dataIndex: "total_leads",
    },
    {
      title: (
        <div className="text-[10px] md:text-[12px] lg:text-[14px]">
          Total Actives
        </div>
      ),
      dataIndex: "total_active",
    },
    {
      title: (
        <div className="text-[10px] md:text-[12px] lg:text-[14px]">
          Total FollowUp
        </div>
      ),
      dataIndex: "total_followUps",
    },
    {
      title: (
        <div className="text-[10px] md:text-[15px] lg:text-[14px]">
          Total Interested
        </div>
      ),
      dataIndex: "totalInterested",
    },
  ];
  const getSourceAnalyticsByCourses = () => {
    const conclusion = {};
    let SD = SourcesData.filter((source) => {
      return !filtername.length > 0 || filtername.includes(source.name);
    });
    // Iterate over the source data
    SD.forEach((source) => {
      // Initialize an empty array for the source if not already present in the conclusion
      if (!conclusion[source.name]) {
        conclusion[source.name] = [];
      }

      // Iterate over the course data
      CourseData.forEach((course) => {
        // Filter lead data based on the current source and course
        const filteredLeads = LeadsData.filter(
          (lead) =>
            lead.source === source.name &&
            lead.course === course.name &&
            (!create_date_object ||
              dayjs(lead.modified_date, "DD-MM-YYYY").isBetween(
                dayjs(FormData.date[0], "DD-MM-YYYY"),
                dayjs(FormData.date[1], "DD-MM-YYYY"),
                "DD-MM-YYYY",
                "[]"
              ))
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
    setgetSourceAnalyticsConcusionByCourses(conclusion);
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
        className="font-bold"
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={textAnchor}
        dominantBaseline="central">
        {/* {CourseData[index].name} */}
      </text>
    );
  };

  const TopFilterTab = () => {
    return (
      <div className="w-12/12  flex justify-between items-center bg-gray-200 rounded mb-2 shadow-lg p-2 ">
        {" "}
        <div className="font-bold text-lg pl-3 w-3/12">Leads Quality</div>
        <div className="flex flex-row justify-end items-center mb-2 w-full flex-wrap">
          {/* /////////////NAME */}
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md w-4/12">
            <label className="text-white font-bold p-1 ">Source Name:</label>
            <Select
              onChange={handleFullName}
              value={FormData.name}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  border: state.isFocused ? "none" : "none",
                  backgroundColor: "transparent",
                  height: "100%",
                }),
              }}
              className="rounded-r-md bg-white p1 w-7/12 font-bold pl-1 focus:outline-none "
              isMulti
              name="colors"
              options={options}
              classNamePrefix="select"
            />
          </div>
          {/* Date Created/// */}
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md w-4/12">
            <label htmlFor="date_created" className="text-white font-bold p-1 ">
              Assign Date:
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
        </div>
      </div>
    );
  };
  const total_count = (courses) => {
    let total_leads = 0;
    let total_followup = 0;
    let total_active = 0;
    let total_interested = 0;
    courses.map((item) => {
      total_leads += item.total_leads;
      total_followup += item.total_followUps;
      total_active += item.total_active;
      total_interested += item.totalInterested;
    });
    return (
      <div className="flex flex-col w-6/12">
        <div className="flex  gap-4 flex-col md:flex-row  lg:flex-row font-bold ml-2 text-[0.8rem] lg:text-[0.8rem]">
          <div className="flex flex-row items-center gap-1  pl-1">
            <div>Leads:</div>
            <div>{total_leads}</div>
          </div>
          <div className="flex flex-row items-center gap-1  pl-1">
            <div>Active:</div>
            <div>{total_active}</div>
          </div>
          <div className="flex flex-row items-center gap-1  pl-1">
            <div>Interested:</div>
            <div>{total_interested}</div>
          </div>
          <div className="flex flex-row items-center gap-1  pl-1">
            <div>FollowUp:</div>
            <div>{total_followup}</div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col">
      {/* <div className="flex gap-2 flex-row flex-wrap m-2 w-12/12">
        {Object.entries(getSourceAnalyticsConcusionByCourses).map(
          ([source, courses]) => (
            <Table
              style={{ width: "32%" }}
              title={() => (
                <h3 className="font-bold text-lg ">{source.toUpperCase()}</h3>
              )}
              bordered
              pagination={false}
              dataSource={courses}
              columns={Graph_column}
            />
          )
        )}
      </div> */}
      <TopFilterTab />
      <div className="flex gap-2 flex-row justify-between flex-wrap ">
        {Object.entries(getSourceAnalyticsConcusionByCourses).map(
          ([source, courses], index) => (
            <div
              key={source}
              className="flex flex-col justify-center items-center bg-white rounded shadow-md shadow-slate-600 w-[33rem]">
              <div className="flex border-b-2 w-full justify-center p-3 text-lg font-bold">
                {source.toUpperCase()}
              </div>
              <PieChart
                title={source}
                width={500}
                height={300}
                className="m-4 rounded">
                <Pie
                  dataKey="total_leads"
                  data={courses}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill={COLORS[index % COLORS.length]}
                  // label={renderCustomizedLabel}
                >
                  {courses.map((course, courseIndex) => (
                    <Cell
                      key={course.course_name}
                      fill={COLORS[courseIndex % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={renderTooltipContent} />
                <Legend />
              </PieChart>
              <Divider style={{ height: "2px", backgroundColor: "black" }} />
              <div className="flex  items-center pb-2 ">
                {total_count(courses)}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SD;
