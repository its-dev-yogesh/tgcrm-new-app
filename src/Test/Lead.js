import React, { useContext } from "react";
import { TGCRMContext } from "../Context/Context";

// const StatusData = [
//   { status_name: "interested", admin_count: "yes", followup_count: "yes" },
//   { status_name: "active", admin_count: "yes", followup_count: "no" },
//   { status_name: "not interested", admin_count: "yes", followup_count: "yes" },
// ];

// const CourseData = [
//   { course_name: "MBA" },
//   { course_name: "bsc" },
//   { course_name: "MBA" },
//   { course_name: "bcom" },
// ];

// const SourcesData = [{ source_name: "cd" }, { source_name: "cw" }];

// const LeadsData = [
//   { lead_name: "demon", status: "active", course: "MBA", source: "cd" },
//   { lead_name: "dado", status: "interested", course: "bcom", source: "cw" },
// ];

const Test = () => {
  const { LeadsData, StatusData, CourseData, SourcesData } =
    useContext(TGCRMContext);
  const generateConclusionArray = () => {
    const conclusion = [];

    SourcesData.forEach((source) => {
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

      LeadsData.forEach((lead) => {
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

    return conclusion;
  };
  const conclusion = generateConclusionArray();
  const courses = CourseData.map((course) => course.name);

  return (
    <table>
      <thead>
        <tr>
          <th>Source</th>
          <th>Total Leads</th>
          <th>Total Active</th>
          <th>Total Follow-up</th>
          {courses.map((course, index) => (
            <th key={index}>{course}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {conclusion.map((item, index) => (
          <tr key={index}>
            <td>{item.source_name}</td>
            <td>{item.total_leads}</td>
            <td>{item.total_active}</td>
            <td>{item.total_followup}</td>
            {courses.map((course, index) => (
              <td key={index}>{item[course]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Test;
