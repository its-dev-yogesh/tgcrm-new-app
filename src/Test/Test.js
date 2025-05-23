import React from "react";

const statusData = [
  { status_name: "interested", admin_count: "yes", followup_count: "yes" },
  { status_name: "active", admin_count: "yes", followup_count: "no" },
  { status_name: "not interested", admin_count: "yes", followup_count: "yes" },
];

const courseData = [
  { course_name: "MBA" },
  { course_name: "bsc" },
  { course_name: "MBA" },
  { course_name: "bcom" },
];

const sourceData = [{ source_name: "cd" }, { source_name: "cw" }];

const leadData = [
  { lead_name: "demon", status: "active", course: "MBA", source: "cd" },
  { lead_name: "dado", status: "interested", course: "bcom", source: "cw" },
];

const generateConclusionArray = () => {
  const conclusion = [];

  sourceData.forEach((source) => {
    const conclusionItem = {
      source_name: source.source_name,
      total_leads: 0,
      total_active: 0,
      total_followup: 0,
    };

    courseData.forEach((course) => {
      conclusionItem[course.course_name] = 0;
    });

    leadData.forEach((lead) => {
      if (lead.source === source.source_name) {
        conclusionItem.total_leads++;

        const matchingStatus = statusData.find(
          (status) => status.status_name === lead.status
        );

        if (matchingStatus) {
          if (matchingStatus.admin_count === "yes") {
            conclusionItem.total_active++;
          }

          if (matchingStatus.followup_count === "yes") {
            conclusionItem.total_followup++;
          }
        }

        const matchingCourse = courseData.find(
          (course) => course.course_name === lead.course
        );

        if (matchingCourse) {
          conclusionItem[matchingCourse.course_name]++;
        }
      }
    });

    conclusion.push(conclusionItem);
  });

  return conclusion;
};

const Test = () => {
  const conclusion = generateConclusionArray();
  const courses = courseData.map((course) => course.course_name);

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
