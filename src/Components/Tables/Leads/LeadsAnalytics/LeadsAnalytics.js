import React, { useContext, useEffect, useState } from "react";
import { TGCRMContext } from "../../../../Context/Context";
import { Table } from "antd";

const data = [
  { name: "rom", res_status: "interested" },
  { name: "rom", res_status: "not interested" },
  { name: "sahil", res_status: "interested" },
  { name: "sahil", res_status: "active" },
  { name: "sahil", res_status: "not interested" },
];

const LeadsAnalytics = () => {
  const { getPerformance, PerformanceData, getStatus, StatusData } =
    useContext(TGCRMContext);
  const [updatedPerformanceArray, setUpdatedPerformanceArray] = useState([]);

  useEffect(() => {
    const result = calculateStatusCounts();
    setUpdatedPerformanceArray(result);
  }, []);
  const [statusCount, setStatusCount] = useState({
    active: 0,
    followUp: 0,
    interested: 0,
  });

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
  const CPD = calculatePerformance(PerformanceData);
  const calculateStatusCounts = () => {
    const updatedPerformanceArray = CPD.map((performance) => {
      let activeCount = 0;
      let followupCount = 0;

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
      });

      return {
        ...performance,
        active: activeCount,
        followup: followupCount,
      };
    });

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
  const columns = [
    {
      title: <span className="font-bold">Staff Name</span>,
      dataIndex: "staff_name",
      editable: true,
      render: (_, record) => (
        <span className="font-bold">{toCamelCase(record.staff_name)}</span>
      ),
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

  return (
    <div className="w-12/12 ">
      {/* <FilterTab /> */}
      <div className="w-12/12 bg-gray-200 rounded overflow-hidden shadow-lg m-4 p-2 ">
        <div className="flex justify-between items-center p-4"></div>

        <div>
          <Table
            bordered
            dataSource={updatedPerformanceArray}
            columns={columns}
            rowClassName="editable-row"
          />
        </div>
      </div>
    </div>
  );
};

export default LeadsAnalytics;
