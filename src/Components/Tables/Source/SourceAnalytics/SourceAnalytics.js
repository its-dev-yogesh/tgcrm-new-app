import React, { useContext, useEffect, useState } from "react";
import { TGCRMContext } from "../../../../Context/Context";
import { Table, DatePicker, Tag, Button } from "antd";
import dayjs from "dayjs";
import Select from "react-select";
import { FaCheck } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import SD from "./SD";
import { CSVLink } from "react-csv";
import { useImportedDate, useTestApi } from "../../../../services/getleads";
import Loader from "../../../Loader/Loader";
import imageError from "../../../../Assets/Images/404.png";
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
const { RangePicker } = DatePicker;
const SourceAnalytics = () => {
  const location = useLocation();
  const { StatusData, getMember, memberData, CourseData, SourcesData } =
    useContext(TGCRMContext);
  const [Leads, setLeads] = useState([]);
  const [analyticsData, setanalyticsData] = useState([]);
  const [Source, setSource] = useState([]);
  const [LeadsData, setLeadsData] = useState([]);
  const [
    getSourceAnalyticsConcusionByCourses,
    setgetSourceAnalyticsConcusionByCourses,
  ] = useState({});
  const [
    getSourceAnalyticsConcusionByCourses_curent,
    setgetSourceAnalyticsConcusionByCourses_current,
  ] = useState({});
  const [FormData, setFormData] = useState({
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
  }); // eslint-disable-next-line
  const [anaLyticsFormData, setanaLyticsFormData] = useState({
    name: [],
    modified_date: [],
  });
  const { testApiHit, isLoading, isError } = useTestApi();
  const {
    getLeadsByImportDate,
    isLoading: isImportLoading,
    isError: isImportError,
  } = useImportedDate();
  const [create_date_object, setcreate_date_object] = useState([]);
  const [AnalyticsDateObject, setAnalyticsDateObject] = useState([]);
  const [OpenFilter, setOpenFilter] = useState(false);
  const [TableData, setTableData] = useState([]);
  const [AnalyticsLeads, setAnalyticsLeads] = useState([]);
  const [AnalyticsTable, setAnalyticsTable] = useState([]);
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
    // setTableData(LeadsData);
    // let temdata = generateConclusionArray(SourcesData, LeadsData);

    // setAnalyticsTable(temdata);
    // let tempCD = getSourceAnalyticsByCourses(SourcesData);
    // getSourceAnalyticsByCourses_current(SourcesData);
    // setAnalyticsLeads(LeadsData);
    // setLeads(LeadsData);
    setSource(SourcesData);
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
  const filterLeads = () => {
    getLeadsByImportDate(
      {
        name: [],
        status: [],
        mobile: [],
        source: filtername,
        course: [],
        date: FormData.date_created,
        assigned_to: [],
        address: [],
        action: [],
        modified_date: [],
        // data: "yogesh",
      },
      {
        onSuccess: (data) => {
          const lowercaseArray = convertArrayValuesToLowercase(
            data?.data?.matchingLeads
          );
          let SD = SourcesData.filter((source) => {
            return !filtername.length > 0 || filtername.includes(source.name);
          });
          getSourceAnalyticsByCourses_current(SD);
          // setTableData(lowercaseArray);
          setLeadsData(lowercaseArray);
        },
      }
    );
    // return Leads.filter(
    //   (item) =>
    //     (!filtername.length > 0 || filtername.includes(item.source)) &&
    //     (!create_date_object ||
    //       dayjs(item.date, "DD-MM-YYYY").isBetween(
    //         dayjs(FormData.date_created[0], "DD-MM-YYYY"),
    //         dayjs(FormData.date_created[1], "DD-MM-YYYY"),
    //         "DD-MM-YYYY",
    //         "[]"
    //       ))
    // );
  };

  let filterAnallyticsname = anaLyticsFormData.name.map((item) => {
    return item.value;
  });
  const filterAnalyticsLeads = () => {
    testApiHit(
      {
        name: [],
        status: [],
        mobile: [],
        source: filterAnallyticsname,
        course: [],
        date: [],
        assigned_to: [],
        address: [],
        action: [],
        modified_date: anaLyticsFormData.modified_date,
        // data: "yogesh",
      },
      {
        onSuccess: (data) => {
          // const lowercaseArray = convertArrayValuesToLowercase(
          //   data?.data?.matchingLeads
          // );
          const lowercaseArray = convertArrayValuesToLowercase(
            data?.data?.matchingLeads
          );
          let SD = SourcesData.filter((source) => {
            return (
              !filterAnallyticsname.length > 0 ||
              filterAnallyticsname.includes(source.name)
            );
          });
          getSourceAnalyticsByCourses(SD);
          generateConclusionArray(SD, lowercaseArray);
          setAnalyticsLeads(lowercaseArray);

          setLeadsData(lowercaseArray);
        },
      }
    );
    // return Leads.filter(
    //   (item) =>
    //     (!filterAnallyticsname.length > 0 ||
    //       filterAnallyticsname.includes(item.source)) &&
    //     (!create_date_object ||
    //       dayjs(item.modified_date, "DD-MM-YYYY").isBetween(
    //         dayjs(anaLyticsFormData.modified_date[0], "DD-MM-YYYY"),
    //         dayjs(anaLyticsFormData.modified_date[1], "DD-MM-YYYY"),
    //         "DD-MM-YYYY",
    //         "[]"
    //       ))
    // );
  };
  const handleFilter = () => {
    const lowercaseArray = convertArrayValuesToLowercase(filterLeads());
    let SD = SourcesData.filter((source) => {
      return !filtername.length > 0 || filtername.includes(source.name);
    });
    getSourceAnalyticsByCourses_current(SD);
    setTableData(lowercaseArray);
  };

  /////////////////Source Analytics Function///////////
  // Step 1: Generate a summary object based on leads array
  const summary = TableData.reduce((acc, lead) => {
    const { source, course } = lead;

    if (!acc[source]) {
      acc[source] = {
        source_name: source,
        totalleads: 0,
        courses: {},
      };
    }

    if (!acc[source].courses[course]) {
      acc[source].courses[course] = 0;
    }

    acc[source].totalleads++;
    acc[source].courses[course]++;

    return acc;
  }, {});

  // Step 2: Convert the summary object into an array
  const tableData = Object.values(summary);

  // Step 3: Get all unique courses
  const courses = Array.from(new Set(LeadsData.map((lead) => lead.course)));

  // Step 4: Create an array of conclusion table data
  const conclusionArray = tableData.map((data) => {
    const row = {
      source_name: data.source_name,
      totalleads: data.totalleads,
    };

    courses.forEach((course) => {
      row[course] = data.courses[course] || 0;
    });

    return row;
  });

  /////////////////////////////////////////////////////

  let CPD = calculatePerformance(convertArrayValuesToLowercase(LeadsData));
  // let CPD;

  const calculateStatusCounts = () => {
    const updatedPerformanceArray = CPD.map((performance) => {
      let activeCount = 0;
      let followupCount = 0;
      let total_Acount = 0;
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
        // console.log(Assigned_count);
      }

      return {
        ...performance,
        active: activeCount,
        followup: followupCount,
        total_Assigned: total_Acount,
      };
    });
    console.log(updatedPerformanceArray);
    setTableData(updatedPerformanceArray);
    return updatedPerformanceArray;
  };

  //////////////////Analytics Performance

  const handleAnalyticsFilter = () => {
    const lowercaseArray = convertArrayValuesToLowercase(
      filterAnalyticsLeads()
    );
    let SD = SourcesData.filter((source) => {
      return (
        !filterAnallyticsname.length > 0 ||
        filterAnallyticsname.includes(source.name)
      );
    });
    getSourceAnalyticsByCourses(SD);
    generateConclusionArray(SD, lowercaseArray);
    setAnalyticsLeads(lowercaseArray);
  };
  const generateConclusionArray = (SD, LD) => {
    const conclusion = [];

    SD.forEach((source) => {
      const conclusionItem = {
        source_name: source.name,
        total_leads: 0,
        total_active: 0,
        total_followup: 0,
        interested: 0,
      };

      CourseData.forEach((course) => {
        conclusionItem[course.name] = 0;
      });

      LD.forEach((lead) => {
        if (lead.source === source.name) {
          conclusionItem.total_leads++;

          const matchingStatus = StatusData.find(
            (status) => status.name === lead.status
          );

          if (matchingStatus) {
            if (matchingStatus.admin_count === "yes") {
              conclusionItem.total_active++;
            }

            if (matchingStatus.followup_count === "yes") {
              conclusionItem.total_followup++;
            }
            if (matchingStatus.name === "interested") {
              conclusionItem.interested++;
            }
          }

          const matchingCourse = CourseData.find(
            (course) => course.name === lead.course
          );

          if (matchingCourse) {
            conclusionItem[matchingCourse.name]++;
          }
        }
      });

      conclusion.push(conclusionItem);
    });
    setAnalyticsTable(conclusion);
    return conclusion;
  };
  // const conclusion = generateConclusionArray(SourcesData);
  const courses_table = CourseData.map((course) => course.name);
  //////////////////////////

  //////getanalytics By Courses ////////////
  const getSourceAnalyticsByCourses = (SD) => {
    const conclusion = {};
    // const Filterted_source = SourcesData.filter((item) => {
    //   return (
    //     !filterAnallyticsname.length > 0 ||
    //     filterAnallyticsname.includes(item.name)
    //   );
    // });

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
                dayjs(anaLyticsFormData.modified_date[0], "DD-MM-YYYY"),
                dayjs(anaLyticsFormData.modified_date[1], "DD-MM-YYYY"),
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

  const getSourceAnalyticsByCourses_current = (SD) => {
    const conclusion = {};
    // const Filterted_source = SourcesData.filter((item) => {
    //   return (
    //     !filterAnallyticsname.length > 0 ||
    //     filterAnallyticsname.includes(item.name)
    //   );
    // });

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
              dayjs(lead.date, "DD-MM-YYYY").isBetween(
                dayjs(FormData.date_created[0], "DD-MM-YYYY"),
                dayjs(FormData.date_created[1], "DD-MM-YYYY"),
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
    setgetSourceAnalyticsConcusionByCourses_current(conclusion);
    return conclusion;
  };

  let columnsDetailed = [
    {
      title: (
        <div className="text-[10px] md:text-[12px] lg:text-[13px] font-bold">
          Course
        </div>
      ),
      // dataIndex: "name",
      render: (_, record) => (
        <div className="text-[10px] md:text-[12px] lg:text-[13px] font-bold">
          {record.name}
        </div>
      ),
      width: "30%",
    },
    {
      title: (
        <div className="text-[10px] md:text-[12px] lg:text-[13px] font-bold">
          Leads
        </div>
      ),
      dataIndex: "total_leads",
      width: "20%",
    },
    {
      title: (
        <div className="text-[10px] md:text-[12px] lg:text-[13px] font-bold">
          Active
        </div>
      ),
      dataIndex: "total_active",
      width: "20%",
    },
    {
      title: (
        <div className="text-[10px] md:text-[12px] lg:text-[13px] font-bold">
          FollowUp
        </div>
      ),
      dataIndex: "total_followUps",
      width: "25%",
    },
    {
      title: (
        <div className="text-[10px] md:text-[15px] lg:text-[13px] font-bold">
          Interested
        </div>
      ),
      dataIndex: "totalInterested",
      width: "25%",
    },
  ];
  ////////////////////////////////////////
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

  const uniqueCourse = [
    ...new Set(
      LeadsData.map((lead) => {
        return lead.course;
      })
    ),
  ];
  const course_data = uniqueCourse.map((lead) => ({
    title: lead,
    dataIndex: lead,
  }));
  const columns = [
    {
      title: <span className="font-bold">Source Name</span>,
      dataIndex: "source_name",
      editable: true,
    },
    {
      title: <span className="font-bold">TotalLeads</span>,
      dataIndex: "totalleads",
      editable: true,
    },
    ...course_data,
  ];
  const Analyticscolumns = [
    {
      title: <span className="font-bold">Source Name</span>,
      dataIndex: "source_name",
      editable: true,
    },

    {
      title: <span className="font-bold">Total Leads</span>,
      dataIndex: "total_leads",
      editable: true,
    },
    {
      title: <span className="font-bold">Total Active</span>,
      dataIndex: "total_active",
      editable: true,
    },
    {
      title: <span className="font-bold">Total FollowUp</span>,
      dataIndex: "total_followup",
      editable: true,
    },
    {
      title: <span className="font-bold">Total Interested</span>,
      dataIndex: "interested",
      editable: true,
    },
    ...course_data,
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
    const newData = { ...FormData };
    newData.date_created = dateString;
    setFormData(newData);
    setcreate_date_object(date);
  };
  const options = SourcesData.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const ImportFilterTab = () => {
    return (
      <div className="flex justify-between items-center">
        <div className="font-bold text-xl pl-3">Imported Data</div>
        <div className="flex flex-row justify-end items-center mb-2 w-9/12 flex-wrap">
          {/* /////////////NAME */}
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md w-4/12">
            <label className="text-white font-bold p-1 ">Source Name:</label>
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
            onClick={filterLeads}
            className=" flex  flex-row justify-center bg-Primary w-24  hover:opacity-80 text-xl  text-white  mr-2 p-2  hover:border-Primary hover:border-opacity-80 rounded">
            <span>
              <FaCheck />
            </span>
          </button>
        </div>
      </div>
    );
  };

  /////////handleName
  const handleAnalyticsFullName = (select) => {
    const newData = { ...anaLyticsFormData };
    newData.name = select;

    setanaLyticsFormData(newData);
  };

  ///handle Date ////
  const handleAnalyticsDateCreated = (date, dateString) => {
    const newData = { ...anaLyticsFormData };
    newData.modified_date = dateString;
    setanaLyticsFormData(newData);
    setAnalyticsDateObject(date);
  };

  const ResponseFilterTab = () => {
    return (
      <div className="flex justify-between items-center">
        <div className="font-bold text-xl pl-3">Leads Quality </div>
        <div className="flex flex-row justify-end items-center mb-2 w-9/12 flex-wrap">
          {/* /////////////NAME */}
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md w-4/12">
            <label className="text-white font-bold p-1 ">Name:</label>
            <Select
              onChange={handleAnalyticsFullName}
              value={anaLyticsFormData.name}
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
              Date Created:
            </label>

            <RangePicker
              value={AnalyticsDateObject}
              presets={rangePresets}
              format="DD-MM-YYYY"
              className="rounded-r-md pr-3  text-2xl bg-white p1 w-7/12 font-bold pl-1 focus:outline-none"
              onChange={handleAnalyticsDateCreated}
            />
          </div>
          {/* submit button */}
          <button
            onClick={filterAnalyticsLeads}
            className=" flex  flex-row justify-center bg-Primary w-24  hover:opacity-80 text-xl  text-white  mr-2 p-2  hover:border-Primary hover:border-opacity-80 rounded">
            <span>
              <FaCheck />
            </span>
          </button>
        </div>
      </div>
    );
  };

  const TopTitle = () => {
    return (
      <div className="w-12/12  bg-gray-200 rounded  shadow-lg m-4 ">
        <div className=" flex flex-row justify-between items-center px-6 py-4">
          <div className="font-bold text-xl mb-2">{Path}</div>
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

  const headers = [
    { label: "course Name", key: "name" },
    { label: "Total Leads", key: "total_leads" },
    { label: "total active", key: "total_active" },
    { label: "total followup", key: "total_followUps" },
    { label: "total Interested", key: "totalInterested" },
  ];

  return (
    <div className="w-12/12 ">
      <TopTitle />
      <div className="w-12/12 bg-gray-200 rounded overflow-hidden shadow-lg m-4 p-2 flex-wrap">
        <ResponseFilterTab />

        <div className="flex  flex-row flex-wrap  w-12/12 justify-between min-h-[300px]">
          {!isLoading ? (
            !isError ? (
              Object.entries(getSourceAnalyticsConcusionByCourses).map(
                ([source, courses]) => (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Button>
                      <CSVLink data={courses} headers={headers}>
                        Export CSV
                      </CSVLink>
                    </Button>
                    <Table
                      className="rounded bg-gray-200 lg:w-[30rem] "
                      scroll={{ y: 300 }}
                      title={() => (
                        <div className="flex flex-col items lg:flex-row md:flex-row md:justify-between font-bold text-lg ">
                          <div className="flex">{source.toUpperCase()}</div>
                          <div>{total_count(courses)}</div>
                        </div>
                      )}
                      bordered
                      dataSource={courses}
                      columns={columnsDetailed}
                    />
                  </div>
                )
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  background: "black",
                  borderRadius: "10px",
                }}>
                <img src={imageError} alt="404" />
              </div>
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>

      <div className="w-12/12 bg-gray-200 rounded overflow-hidden shadow-lg m-4 p-2 flex-wrap">
        <ImportFilterTab />

        <div className="flex  flex-row flex-wrap  w-12/12 justify-between min-h-[300px]">
          {!isImportLoading ? (
            !isImportError ? (
              Object.entries(getSourceAnalyticsConcusionByCourses_curent).map(
                ([source, courses]) => (
                  <div className="flex flex-col">
                    <Button>
                      <CSVLink data={courses} headers={headers}>
                        Export CSV
                      </CSVLink>
                    </Button>{" "}
                    <Table
                      className="rounded bg-gray-200  lg:w-[30rem]"
                      scroll={{ y: 300 }}
                      title={() => (
                        <div className="flex flex-col items lg:flex-row md:flex-row md:justify-between font-bold text-lg ">
                          <div className="flex">{source.toUpperCase()}</div>
                          <div>{total_count(courses)}</div>
                        </div>
                      )}
                      bordered
                      dataSource={courses}
                      columns={columnsDetailed}
                    />
                  </div>
                )
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  background: "black",
                  borderRadius: "10px",
                }}>
                <img src={imageError} alt="404" />
              </div>
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>
      {/* <div className="w-12/12 bg-gray-200 rounded overflow-hidden shadow-lg m-4 p-2 ">
        <div className="flex justify-between items-center p-4">
          {/* <button onClick={handleFilter}>click</button> 
        </div>
        {/* <button onClick={() => console.log(course_data)}>clickl</button> 
        <div className="flex flex-col">
          <ImportFilterTab />

          <Table
            scroll={{ y: 300 }}
            bordered
            dataSource={conclusionArray}
            columns={columns}
            rowClassName="editable-row"
          />
        </div>
      </div> */}
    </div>
  );
};

export default SourceAnalytics;
