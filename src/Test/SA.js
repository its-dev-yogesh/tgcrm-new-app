import React, { useContext } from "react";
import { Table } from "antd";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { TGCRMContext } from "../Context/Context";

const SD = () => {
  const { LeadsData, StatusData, CourseData, SourcesData } =
    useContext(TGCRMContext);

  let columns = [
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
  const generateConclusion = () => {
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
  const conclusionData = generateConclusion();
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
    const legendItems = Object.entries(conclusionData).map(
      ([source, courses], index) => {
        return (
          <span key={source} style={{ marginRight: "10px" }}>
            <span
              style={{
                backgroundColor: COLORS[index % COLORS.length],
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
              }}
            ></span>
            {" " + source}
          </span>
        );
      }
    );

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
        dominantBaseline="central"
      >
        {CourseData[index].name}
      </text>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 flex-row flex-wrap m-2 w-12/12">
        {Object.entries(conclusionData).map(([source, courses]) => (
          <Table
            className="w-90 lg:w-50"
            title={() => (
              <h3 className="font-bold text-lg ">{source.toUpperCase()}</h3>
            )}
            bordered
            pagination={false}
            dataSource={courses}
            columns={columns}
          />
        ))}
      </div>

      {/* jdfhdhfkjdhf 
      <div className="flex gap-2 flex-row flex-wrap m-2">
        {Object.entries(conclusionData).map(([source, courses], index) => (
          <div
            key={source}
            className="flex flex-col justify-center items-center bg-white rounded shadow-md shadow-slate-600 "
          >
            <div className="flex border-b-2 w-full justify-center p-3 text-lg font-bold">
              {source.toUpperCase()}
            </div>
            <PieChart
              title={source}
              width={400}
              height={300}
              className="m-4 rounded"
            >
              <Pie
                dataKey="total_leads"
                data={courses}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill={COLORS[index % COLORS.length]}
                label={renderCustomizedLabel}
              >
                {courses.map((course, courseIndex) => (
                  <Cell
                    key={course.course_name}
                    fill={COLORS[courseIndex % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={renderTooltipContent} />
              {/* <Legend /> 
            </PieChart>
          </div>
        ))} 
      </div>*/}
    </div>
  );
};

export default SD;
