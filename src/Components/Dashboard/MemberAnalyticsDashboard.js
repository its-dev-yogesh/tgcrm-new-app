import { Form, Input, InputNumber, Menu, Table, Tag } from "antd";
import dayjs from "dayjs";

import Select from "react-select";
import { useContext, useEffect, useRef, useState } from "react";
import { DatePicker, message } from "antd";

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaCheck,
  FaFilter,
  FaInfo,
  FaPhone,
  FaPhoneAlt,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa";

import axios from "axios";
import { TGCRMContext } from "../../Context/Context";
import styled from "styled-components";

var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
const { RangePicker } = DatePicker;
const originData = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const MemberAnalyticsDashboard = () => {
  const location = useLocation();
  const {
    getMember,
    memberData,
    getLeads,
    LeadsData,
    getStatus,
    StatusData,
    SourcesData,
    CourseData,
    AuthUser,
    PerformanceData,
    getPerformance,
  } = useContext(TGCRMContext);
  const [selectedView, setSelectedView] = useState("call");
  const [IsSubmit, setIsSubmit] = useState("");
  const [Users, setUsers] = useState([]);
  const [assignedMembers, setassignedMembers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [Leads, setLeads] = useState([]);
  const [NewStatus, setNewStatus] = useState([]);
  const [NewCourse, setNewCourse] = useState([]);
  const [NewSourceData, setNewSourceData] = useState([]);
  // Access the current pathname, search, and hash
  const { pathname } = location;
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [Path, setPath] = useState("");
  const [OpenFilter, setOpenFilter] = useState(false);
  const [OpenRegForm, setOpenRegForm] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [TableData, setTableData] = useState([]);
  const [SD, setSD] = useState([]);
  const [PerformanceTable, setPerformanceTable] = useState([]);
  const [PerformancetempData, setPerformancetempData] = useState([]);
  const [assign_to, setassign_to] = useState([]);
  const [date, setDate] = useState(null);
  const [create_date_object, setcreate_date_object] = useState([]);
  const [Analyticsdate_object, setAnalyticsdate_object] = useState([]);
  const [isTask, setisTask] = useState(false);
  const [TaskType, setTaskType] = useState("assign");
  const [FormData, setFormData] = useState({
    name: [],
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
  }); // eslint-disable-next-line
  const [analyticsDateFilter, setanalyticsDateFilter] = useState([]);
  const [Status_count, setStatus_count] = useState({
    active: 0,
    followUps: 0,
    interested: 0,
  });
  const [totalindividualStatusCount, settotalindividualStatusCount] = useState(
    {}
  );
  const [TotalAssign, setTotalAssign] = useState(0);
  ///////////Row Selection//////////////
  const [selectionType, setSelectionType] = useState("manual");
  const [selectedRows, setSelectedRows] = useState([]);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [selectedData, setselectedData] = useState([]);
  const [selectedRowsKey, setSelectedRowsKey] = useState([]);
  const [openanalytics, setopenanalytics] = useState("");
  const [ResponseData, setResponseData] = useState({
    staff_id: AuthUser._id,
    staff_name: AuthUser.full_name,
    lead_id: "",
    lead_status: "",
    lead_course: "",
    lead_comment: "",
    res_date: dayjs().format("DD-MM-YYYY"),
    previous_status: "",
    lead_color: "",
  });
  const [messageApi, contextHolder] = message.useMessage();
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const handleToggle = () => {
    setIsChecked(!isChecked);
  };
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      callMSg();
    }
  }, []);
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
    if (AuthUser) {
      setPerformancetempData(PerformanceData);
      const UserPerformance = PerformanceData.filter((item) =>
        dayjs(item.res_date, "DD-MM-YYYY").isBetween(
          dayjs(analyticsDateFilter[0], "DD-MM-YYYY)"),
          dayjs(analyticsDateFilter[1], "DD-MM-YYYY)"),
          "DD-MM-YYYY",
          "[]"
        )
      );

      setPerformanceTable(UserPerformance);
    }
    totalindividualStatusCountFunc(PerformanceTable);
  }, [getPerformance]);

  useEffect(() => {
    const strAscending = [...memberData].sort((a, b) =>
      a.name > b.name ? 1 : -1
    );

    setUsers(memberData);

    const data = memberData.filter((item) => {
      return item.role === "admin";
    });
    console.log("Admins", data);
    setAdminUsers(data);
  }, [getMember]);
  useEffect(() => {
    handleAnalyticsFilter();
  }, [PerformancetempData]);

  useEffect(() => {
    const newArray = LeadsData.map((obj, index) => {
      return { ...obj, ["key"]: index };
    });
    const tempCourse = [{ name: "none" }, ...CourseData];
    setNewCourse(tempCourse);
    setNewSourceData(SourcesData);
    setNewStatus(StatusData);
    if (AuthUser) {
      setLeads(LeadsData);
      const newLeads = LeadsData.filter((item) => {
        return dayjs(item.modified_date, "DD-MM-YYYY").isBetween(
          dayjs(FormData.date[0], "DD-MM-YYYY"),
          dayjs(FormData.date[1], "DD-MM-YYYY"),
          "DD-MM-YYYY",
          "[]"
        );
      });
      setTableData(newLeads);
    }
  }, [getLeads]);

  const StyledRangePickerContainer = styled.div`
    .ant-picker-panel {
      &:last-child {
        width: 0;
        .ant-picker-header {
          position: absolute;
          right: 0;
          .ant-picker-header-prev-btn,
          .ant-picker-header-view {
            visibility: hidden;
          }
        }

        .ant-picker-body {
          display: none;
        }

        @media (min-width: 768px) {
          width: 280px !important;
          .ant-picker-header {
            position: relative;
            .ant-picker-header-prev-btn,
            .ant-picker-header-view {
              visibility: initial;
            }
          }

          .ant-picker-body {
            display: block;
          }
        }
      }
    }
  `;

  const success = () => {
    messageApi.open({
      content: (
        <div className="flex flex-col gap-3">
          <div className=" flex justify-start items-center text-lg">
            <div className=" w-6 h-6 text-white flex text-base items-center justify-center rounded-full bg-green-600 mr-2">
              <FaCheck />
            </div>
            <div className=" text-green-600"> Leads Assigned Successfully</div>
          </div>
        </div>
      ),
      className: "mt-10",
      icon: null,
    });
  };
  const callMSg = () => {
    messageApi.open({
      content: (
        <div className="flex flex-col gap-3">
          <div className=" flex justify-start items-center text-lg">
            <div className=" w-6 h-6 text-white flex text-base items-center justify-center rounded-full bg-yellow-600 mr-2">
              <FaInfo />
            </div>
            <div className=" text-yellow-600 font-bold">
              {" "}
              All Calls will be Recorded
            </div>
          </div>
        </div>
      ),
      className: "mt-10",
      icon: null,
    });
  };
  const errorMsg = (msg) => {
    messageApi.open({
      content: (
        <div className="flex flex-col gap-3">
          <div className=" flex justify-start items-center text-lg">
            <div className=" w-6 h-6 text-white flex text-base items-center justify-center rounded-full bg-red-600 mr-2">
              X
            </div>
            <div className="font-bold text-red-600">{msg}</div>
          </div>
        </div>
      ),
      className: "mt-10",
      icon: null,
    });
  };
  //////handle Lead Response Data////
  const handleResponseSubmit = async (lead_id, lead_preStatus) => {
    const newdata = { ...ResponseData };
    newdata.lead_id = lead_id;
    newdata.previous_status = lead_preStatus;
    if (newdata.lead_course && newdata.lead_status) {
      try {
        setIsSubmit(lead_id);
        const response = await fetch("https://tgcrm-new-api.vercel.app//performance", {
          method: "POST",
          body: JSON.stringify(newdata),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response) {
          try {
            const leadRes = await fetch(
              "https://tgcrm-new-api.vercel.app//update-status-leads",
              {
                method: "POST",
                body: JSON.stringify(newdata),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (leadRes) {
              getLeads();
              getPerformance();
              setIsSubmit("");
            }
            console.log(await leadRes.json());
          } catch (error) {
            console.log(error);
            setIsSubmit("");
          }
        }
        console.log(await response.json());
      } catch (error) {
        console.log(error);
        setIsSubmit("");
      }
    } else {
      alert(
        "Status or Course Not Updated! Please Select `none` for `No Selection`"
      );
    }
  };
  const handleResponseComment = (e) => {
    const newData = { ...ResponseData };
    newData.lead_comment = e.target.value;
    setResponseData(newData);
  };
  const handleResponseCourse = (e) => {
    const newData = { ...ResponseData };
    newData.lead_course = e.target.value;
    setResponseData(newData);
  };
  const handleResponseStatus = (e) => {
    const newData = { ...ResponseData };
    const text = e.target.value.split("|");
    console.log(text);
    newData.lead_status = text[0];
    newData.lead_color = text[1];
    setResponseData(newData);
  };

  const handleFullName = (select) => {
    const newData = { ...FormData };
    newData.name = select;

    setFormData(newData);
  };

  const handleGender = (e) => {
    const newData = { ...FormData };
    newData.gender = e;
    setFormData(newData);
  };

  const handleStatus = (e) => {
    const newData = { ...FormData };
    newData.status = e;
    setFormData(newData);
  };

  const handlePhoneNo = (e) => {
    const newData = { ...FormData };
    newData.mobile = e;
    setFormData(newData);
  };

  const handleSource = (e) => {
    const newData = { ...FormData };
    newData.source = e;
    setFormData(newData);
  };

  const handleDOB = (date, datestring) => {
    const newData = { ...FormData };
    newData.dob = datestring;
    setDate(date);
    setFormData(newData);
  };

  const handleRole = (e) => {
    const newData = { ...FormData };
    newData.role = e;
    setFormData(newData);
  };

  const handleCourse = (e) => {
    const newData = { ...FormData };
    newData.course = e;
    setFormData(newData);
  };

  const handleDateCreated = (date, dateString) => {
    console.log("date Created", dateString);
    const newData = { ...FormData };
    newData.date = dateString;
    setFormData(newData);
    setcreate_date_object(date);
    console.log("date Created", dateString);
  };

  const handleAnalyticsDateCreated = (date, dateString) => {
    setanalyticsDateFilter(dateString);
    setAnalyticsdate_object(date);
    console.log("date analytics", dateString);
  };

  const handleAssignedUnder = (e) => {
    const newData = { ...FormData };
    newData.assigned_under = e;
    setFormData(newData);
  };

  const handleAssignedBy = (e) => {
    const newData = { ...FormData };

    newData.assigned_to = e;
    setFormData(newData);
  };

  const handleAddress = (e) => {
    const newData = { ...FormData };
    newData.address = e;
    setFormData(newData);
  };

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: <span className="font-bold">Name</span>,
      width: "18%",
      editable: true,
      dataIndex: "name",
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.name}</span>
          </>
        );
      },
    },
    {
      title: <span className="font-bold">Phone No.</span>,
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.mobile}</span>
          </>
        );
      },
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">Status</span>,

      editable: true,
      render: (_, record) => {
        return (
          <>
            <Tag
              className="font-bold text-sm"
              color={
                record.role === "admin"
                  ? "blue"
                  : record.role === "manager"
                  ? "green"
                  : "blue"
              }>
              {record.status}
            </Tag>
          </>
        );
      },
    },

    {
      title: <span className="font-bold">Source</span>,
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.source}</span>
          </>
        );
      },
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">Location</span>,
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.address}</span>
          </>
        );
      },
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">Course</span>,
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.course}</span>
          </>
        );
      },
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">Assigned to</span>,
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.assigned_to}</span>
          </>
        );
      },
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">assigned Info</span>,
      render: (_, record) => {
        return (
          <>
            {record.assigned_info.map((item, assigned_seq) => (
              <div className="flex">
                <span key={assigned_seq} className="font-bold mr-2">
                  {" "}
                  {item.to}
                </span>
                <div>
                  <span key={assigned_seq} className="font-bold mr-2">
                    {" "}
                    {item.assigned_seq}
                  </span>
                </div>
              </div>
            ))}
          </>
        );
      },
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">Date</span>,
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.date}</span>
          </>
        );
      },
      width: "10%",
      editable: true,
    },

    {
      title: <span className="font-bold">View</span>,
      render: (_, record) => {
        return (
          <>
            <Link className="font-bold mr-2">View Profile</Link>
          </>
        );
      },
      width: "10%",
      editable: true,
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  ///////////////handle filter toggle /////////////
  const handlefilterToggle = () => {
    setOpenRegForm(false);
    setOpenFilter(!OpenFilter);
  };
  ///////////////handle Registration Toggle /////////////
  const handleRegToggle = () => {
    setOpenRegForm(!OpenRegForm);
    setOpenFilter(false);
  };

  ///////////////Options///////////////////
  const role_options = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "executive", label: "Executive" },
  ];
  const gender_options = [
    { value: "male", label: "Male" },
    { value: "memale", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const options = Users.map((item) => ({
    value: item.full_name,
    label: item.full_name,
  }));
  const name_options = Users.map((item) => ({
    value: item.name,
    label: item.name,
  }));
  const source_options = NewSourceData.map((item) => ({
    value: item.name,
    label: item.name,
  }));
  const course_options = NewCourse.map((item) => ({
    value: item.name,
    label: item.name,
  }));
  const phone_options = Leads.map((item) => ({
    value: item.mobile,
    label: item.mobile,
  }));
  let status_options = NewStatus.map((item) => ({
    value: item.name,
    label: item.name,
  }));
  status_options = [{ value: "fresh", label: "fresh" }, ...status_options];
  const uniqueAddress = [...new Set(Leads.map((item) => item.address))];
  const address_options = uniqueAddress.map((item) => ({
    value: item,
    label: item,
  }));

  let filtername = FormData.name.map((item) => {
    return item.value;
  });
  let filterRole = FormData.role.map((item) => {
    return item.value;
  });
  let filtercourse = FormData.course.map((item) => {
    return item.value;
  });
  let filtersource = FormData.source.map((item) => {
    return item.value;
  });
  let filterstatus = FormData.status.map((item) => {
    return item.value;
  });
  let filterPhone = FormData.mobile.map((item) => {
    return item.value;
  });
  let filterassigned_under = FormData.assigned_under.map((item) => {
    return item.value;
  });
  let filterassigned_to = FormData.assigned_to.map((item) => {
    return item.value;
  });
  let filteraddress = FormData.address.map((item) => {
    return item.value;
  });
  let filtergender = FormData.gender.map((item) => {
    return item.value;
  });
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

    setTableData(lowercaseArray);
  };
  const handleReset = () => {
    setTableData(Users);
    const newData = {
      name: [],
      gender: [],
      status: [],
      mobile: [],
      source: [],
      dob: "",
      role: [],
      course: [],
      date: [],
      assigned_under: [],
      assigned_to: [],
      address: [],
    };
    setcreate_date_object([]);
    setFormData(newData);
  };

  const rep = (Users) => {
    setassignedMembers(Users);
    const updatedMembers = Users.map((record) => {
      const assignedById = record.assigned_to;
      const assignedUser = Users.find((item) => item._id === assignedById);

      if (assignedUser) {
        record.assigned_to = assignedUser.name;
      }

      return record;
    });
    setTableData(updatedMembers);
    return updatedMembers;
  };
  const countFunction = (PT) => {
    const NS = { ...Status_count };
    NS.active = 0;
    NS.followUps = 0;
    NS.interested = 0;
    PT.forEach((performance) => {
      const { staff_name, lead_status } = performance;

      // Find the matching status object with admin_count set to "yes"
      const activecount = NewStatus.find(
        (status) =>
          status.name.toLowerCase() === lead_status.toLowerCase() &&
          status.admin_count === "yes"
      );
      const followcount = NewStatus.find(
        (status) =>
          status.name.toLowerCase() === lead_status.toLowerCase() &&
          status.followup_count === "yes"
      );

      if (activecount) {
        // Increment the Active count
        NS.active += 1;
      }
      if (followcount) {
        // Increment the Active count
        NS.followUps += 1;
      }
      if (lead_status.toLowerCase() === "interested") {
        // Increment the Active count
        NS.interested += 1;
      }
    });
    setStatus_count(NS);

    console.log(NS);
  };

  const handleAnalyticsFilter = () => {
    const lowercaseArray = convertArrayValuesToLowercase(filterAnanlytics());
    const temAssign = filterTotalAssigned().length;
    setTotalAssign(temAssign);
    totalindividualStatusCountFunc(lowercaseArray);
    setPerformanceTable(lowercaseArray);
    countFunction(lowercaseArray);
  };

  const totalindividualStatusCountFunc = (data) => {
    const temp = { ...totalindividualStatusCount };
    NewStatus.map((item) => {
      temp[item.name] = 0;
    });
    // Loop through the data array and count the status values
    data.forEach((item) => {
      const { lead_status } = item;
      if (temp[lead_status]) {
        temp[lead_status] += 1;
      } else {
        temp[lead_status] = 1;
      }
    });
    settotalindividualStatusCount(temp);
    return totalindividualStatusCount;
  };

  const filterAnanlytics = () => {
    return PerformancetempData.filter(
      (item) =>
        item.staff_id === filtername &&
        (!Analyticsdate_object ||
          dayjs(item.res_date, "DD-MM-YYYY").isBetween(
            dayjs(analyticsDateFilter[0], "DD-MM-YYYY"),
            dayjs(analyticsDateFilter[1], "DD-MM-YYYY"),
            "DD-MM-YYYY",
            "[]"
          ))
    );
  };
  const filterTotalAssigned = () => {
    return AuthUser.assigned_info.filter(
      (item) =>
        !Analyticsdate_object ||
        dayjs(item.assign_date, "DD-MM-YYYY").isBetween(
          dayjs(analyticsDateFilter[0], "DD-MM-YYYY"),
          dayjs(analyticsDateFilter[1], "DD-MM-YYYY"),
          "DD-MM-YYYY",
          "[]"
        )
    );
  };
  const filterLeads = () => {
    return Leads.filter(
      (item) =>
        (!filtername.length > 0 || filtername.includes(item.name)) &&
        (!filtersource.length > 0 || filtersource.includes(item.source)) &&
        (!filterPhone.length > 0 || filterPhone.includes(item.mobile)) &&
        (!filterstatus.length > 0 || filterstatus.includes(item.status)) &&
        (!filterassigned_to.length > 0 ||
          filterassigned_to.includes(item.assigned_to)) &&
        (!filterstatus.length > 0 || filterstatus.includes(item.status)) &&
        (!filtercourse.length > 0 || filtercourse.includes(item.course)) &&
        (!filteraddress.length > 0 || filteraddress.includes(item.address)) &&
        (!filtergender.length > 0 || filtergender.includes(item.gender)) &&
        (!FormData.dob > 0 || FormData.dob === item.dob) &&
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
  // leadFiltertab/////
  const FilterTab = () => {
    return (
      <div className="w-12/12  bg-white/30 backdrop-blur-lg rounded  shadow-lg mt-4 mb-1 mx-2  ">
        <div className=" flex flex-row items-center justify-between p-1">
          {!isChecked ? (
            <button
              onClick={() => setIsChecked(!isChecked)}
              className="font-bold text-lg pl-2 text-white">
              <FaBars />
            </button>
          ) : (
            <button
              onClick={() => setIsChecked(!isChecked)}
              className="font-bold text-lg pl-2 text-white">
              X
            </button>
          )}

          <div className="font-bold text-sm  text-white">
            {selectedView === "call" ? "Dashboard" : "Analytics"}
          </div>
          <div>
            <button
              onClick={handlefilterToggle}
              className="  hover:opacity-50 text-sm  text-white font-bold  py-2 px-4  hover:border-Primary hover:border-opacity-25 rounded">
              {OpenFilter ? (
                <span>X</span>
              ) : (
                <span>
                  <FaFilter />
                </span>
              )}
            </button>

            {/* <button
              onClick={handleReset}
              className="bg-Primary hover:opacity-50 text-sm  text-white font-bold  py-2 px-4 border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded"
            >
              Reset
            </button> */}
          </div>
        </div>
        {OpenFilter && (
          <div className={`bg-white flex flex-col p-2 mb-5 w-full `}>
            <div className="font-bold text-xl m-2 ">
              <span>Leads Filter :</span>
            </div>

            <div className="flex flex-row justify-between mb-2 w-full flex-wrap">
              <div className="  flex flex-col justify-start flex-grow ">
                {/* /////////////NAME */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md ">
                  <label className="text-white font-bold p-1">Name:</label>
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
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none "
                    isMulti
                    name="colors"
                    options={name_options}
                    classNamePrefix="select"
                  />
                </div>
                {/* Phone No. */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md ">
                  <label className="text-white font-bold p-1">Phone No:</label>
                  <Select
                    onChange={handlePhoneNo}
                    value={FormData.mobile}
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
                    options={phone_options}
                    classNamePrefix="select"
                  />
                </div>
              </div>
              <div className="  flex flex-col justify-start flex-grow">
                {/* status */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">status:</label>
                  <Select
                    onChange={handleStatus}
                    value={FormData.status}
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
                    options={status_options}
                    classNamePrefix="select"
                  />
                </div>
                {/* Course */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Course:</label>
                  <Select
                    onChange={handleCourse}
                    value={FormData.course}
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
                    options={course_options}
                    classNamePrefix="select"
                  />
                </div>
              </div>
              <div className="  flex flex-col justify-start flex-grow">
                {/* Date Created/// */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label
                    htmlFor="date"
                    className="text-white font-bold p-1 w-9/12">
                    Date Created:
                  </label>

                  <RangePicker
                    panelRender={(panelNode) => (
                      <StyledRangePickerContainer>
                        {panelNode}
                      </StyledRangePickerContainer>
                    )}
                    value={create_date_object}
                    presets={rangePresets}
                    format="DD-MM-YYYY"
                    className="rounded-r-md pr-3  text-md bg-slate-200 p1 w-full font-bold pl-1 focus:outline-none"
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
  // Analytics filtertab////
  const AnalyticsFilterTab = () => {
    return (
      <div className="w-12/12  bg-white/30 backdrop-blur-lg rounded  shadow-lg mt-4 mb-2 mx-2  ">
        <div className=" flex flex-row items-center justify-between p-1">
          {!isChecked ? (
            <button
              onClick={() => setIsChecked(!isChecked)}
              className="font-bold text-lg pl-2 text-white">
              <FaBars />
            </button>
          ) : (
            <button
              onClick={() => setIsChecked(!isChecked)}
              className="font-bold text-lg pl-2 text-white">
              X
            </button>
          )}
          <div className="font-bold text-sm  text-white">
            {selectedView === "call" ? "Dashboard" : "Analytics"}
          </div>
          <div className="flex w-7/12 gap-2">
            <RangePicker
              panelRender={(panelNode) => (
                <StyledRangePickerContainer>
                  {panelNode}
                </StyledRangePickerContainer>
              )}
              value={Analyticsdate_object}
              presets={rangePresets}
              format="DD-MM-YYYY"
              className="rounded-r-md pr-3  text-md bg-slate-200 p1 w-full font-bold pl-1 focus:outline-none"
              onChange={handleAnalyticsDateCreated}
            />

            <button
              onClick={handleAnalyticsFilter}
              className="bg-white hover:opacity-50 text-sm  text-green-600 font-bold  py-2 px-4  hover:border-Primary hover:border-opacity-25 rounded">
              <FaCheck />
            </button>
          </div>
        </div>
      </div>
    );
  };

  ////////////handle Row Selection/////////////////////////
  const handleSelectionTypeChange = (e) => {
    setSelectionType(e.target.value);
  };

  const handleInputChange = (e) => {
    if (e.target.value > 0) {
      setNumberOfRows(parseInt(e.target.value, 10));
    } else {
      let selectedData = [];

      const keys = selectedData.map((item) => item.key);
      setSelectedRowsKey(keys);

      setNumberOfRows(0);
    }
  };
  const handleTaskType = (e) => {
    const task = e.target.value;
    setTaskType(task);
  };
  const handleButtonClick = () => {
    if (numberOfRows && numberOfRows <= TableData.length) {
      let selectedData = [];

      if (selectionType === "manual") {
        selectedData = selectedRows.map((row, index) => row);
      } else if (selectionType === "top") {
        selectedData = TableData.slice(0, numberOfRows).map(
          (row, index) => row
        );
      } else if (selectionType === "bottom") {
        selectedData = TableData.slice(-numberOfRows).map((row, index) => row);
      } else {
        selectedData = [];
      }
      setselectedData(selectedData);
      const keys = selectedData.map((item) => item.key);
      setSelectedRowsKey(keys);
      console.log("Selected Rows:", selectedData);
    } else if (numberOfRows && numberOfRows > TableData.length) {
      alert(`Only ${TableData.length} Data available`);
    } else {
      alert(`No Data Selected`);
    }
  };
  const handleDeselect = () => {
    let selectedData = [];

    const keys = selectedData.map((item) => item.key);
    setSelectedRowsKey(keys);
    setNumberOfRows(0);
    setSelectedRows([]);
  };
  const assign_leads = async () => {
    console.log("selectedData:", selectedData);
    const newArray = selectedData.map((obj) => {
      return {
        lead_id: obj._id,
        assign_date: dayjs().format("DD-MM-YYYY"),
      };
    });

    if (assign_to.length > 2 && selectedRowsKey.length > 0) {
      const newAssign = {
        member_id: assign_to[0],
        member_name: assign_to[1],
        leads: newArray,
      };
      try {
        setisTask(true);
        const response = await axios.post(
          "https://tgcrm-new-api.vercel.app//assign-leads",
          newAssign
        );

        if (response.data) {
          try {
            const leadResponse = await axios.post(
              "https://tgcrm-new-api.vercel.app//update-leads",
              newAssign
            );
            if (leadResponse) {
              setisTask(false);
              handleDeselect();
              setassign_to([]);
              success();
            }
            // Handle the leadResponse
            console.log(leadResponse.data);
            getLeads();
          } catch (error) {
            // Handle the error
            setassign_to([]);
            setisTask(false);
            errorMsg("error");
            console.error(error);
          }
        }

        // Handle the response
        console.log(response.data);
      } catch (error) {
        setassign_to([]);
        setisTask(false);
        // Handle the error
        errorMsg("error");
        console.error(error);
      }
    } else {
      setassign_to([]);
      errorMsg("  Leads or Member Not Selected !");
    }
  };

  let TaskButton;
  if (isTask === false) {
    TaskButton =
      TaskType === "assign" ? (
        <button
          type="submit"
          className=" bg-Primary hover:opacity-50 text-lg h-auto  text-white  px-2  border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded" // disabled={!isFormValid()}
          onClick={assign_leads}>
          Assign
        </button>
      ) : (
        <button
          className=" bg-Primary hover:opacity-50 text-lg h-auto  text-white  px-2  border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded" // disabled={!isFormValid()}
          onClick={() => {
            console.log("deleted");
          }}>
          Delete<i className="fa-solid fa-house"></i>
        </button>
      );
  } else {
    TaskButton = (
      <button
        disabled
        className="flex justify-center items-center bg-Primary hover:opacity-50 text-lg h-auto  text-white  px-2  border-b-4 border-yellow-800 hover:border-Primary opacity-50 rounded">
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-4 h-4 mr-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Assign...
      </button>
    );
  }

  const topMenu = (
    <div className=" flex flex-col items-center min-w-full">
      {/* Top Selection Card */}
      <div className="flex flex-row items-center w-full bg-white/30 backdrop-blur-sm h-16 text-white ">
        {/* Call Button */}
        <button
          onClick={() => {
            setSelectedView("call");
          }}
          className={`flex justify-center items-center w-full h-full text-2xl font-bold border-b-4 box-border ${
            selectedView === "call" ? " border-green-500" : "border-slate-500"
          } `}>
          Dashboard
        </button>
        {/* Call Analytics button */}
        <button
          onClick={() => {
            setSelectedView("analytics");
          }}
          className={`flex justify-center items-center w-full h-full text-2xl font-bold border-b-4 box-border ${
            selectedView === "analytics"
              ? "border-b-4 border-green-500"
              : "border-slate-500"
          } `}>
          Ananlytics
        </button>
      </div>
    </div>
  );
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
  const StatusComp = (props) => (
    <div
      className={`flex flex-col w-44 justify-start  m-1 rounded border-2 border-white  `}>
      <div className="flex justify-center items-center py-1 w-full    text-white">
        {props.name}
      </div>
      <div className="flex justify-center items-center py-1 w-full   text-white">
        {props.value}
      </div>
    </div>
  );
  const leadStatusCounts = {};

  const statusIndividualCount = PerformanceTable.forEach((performance) => {
    const { lead_status } = performance;
    if (lead_status) {
      if (leadStatusCounts[lead_status]) {
        leadStatusCounts[lead_status]++;
      } else {
        leadStatusCounts[lead_status] = 1;
      }
    }
  });

  const AnalyticsComp = (props) => (
    <div
      className="flex flex-col w-12/12    backdrop-blur-sm bg-white/30 rounded shadow-sm mt-1 mb-4 mx-2 
     ">
      {/* Info column*/}
      <div className="flex flex-col justify-between items-center text-lg font-sans font-bold p-1  w-full ">
        <button
          onClick={() => {
            setopenanalytics(props.name);
          }}
          className={`flex justify-center items-center py-1 w-full rounded-md my-1  text-white`}>
          Total {props.name} : {props.value}
        </button>
        <div
          className={`flex flex-row justify-between flex-wrap items-center text-lg font-sans font-bold w-12/12 ${
            openanalytics === props.name ? "visible" : "hidden"
          }`}>
          {NewStatus.map(
            (item) =>
              (item.admin_count === "yes" && props.name === "active" && (
                <StatusComp
                  name={toCamelCase(item.name)}
                  value={totalindividualStatusCount[item.name]}
                  color={props.color_code}
                />
              )) ||
              (item.followup_count === "yes" && props.name === "followUps" && (
                <StatusComp
                  name={toCamelCase(item.name)}
                  value={totalindividualStatusCount[item.name]}
                  color={props.color}
                />
              )) ||
              (item.name === "interested" && props.name === "interested" && (
                <StatusComp
                  name={toCamelCase(item.name)}
                  value={totalindividualStatusCount[item.name]}
                  color={props.color}
                />
              ))
          )}
        </div>
      </div>
      {/* Active */}
    </div>
  );
  const logout = () => {
    window.localStorage.removeItem("token_id");
    navigate("/");
  };
  const SideMenu = () => {
    return (
      <div
        className="z-50 absolute mx-2  text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
        id="user-dropdown">
        <div className="px-4 py-3">
          <span className="block text-sm text-gray-900 dark:text-white">
            {AuthUser.full_name}
          </span>
          <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
            {AuthUser.email}
          </span>
        </div>
        <ul className="py-2" aria-labelledby="user-menu-button">
          {selectedView === "call" ? (
            <li>
              <button
                onClick={() => setSelectedView("analytics")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                Analytics
              </button>
            </li>
          ) : (
            <li>
              <button
                onClick={() => setSelectedView("call")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                Call
              </button>
            </li>
          )}

          <li>
            <button
              onClick={logout}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
              Sign out
            </button>
          </li>
        </ul>
      </div>
    );
  };
  const formValidation = () => {
    return ResponseData.lead_course && ResponseData.lead_status;
  };
  return (
    <div
      id="container"
      className=" min-h-screen max-h-screen w-12/12  bg-slate-500 overflow-hidden">
      {contextHolder}
      {/* {topMenu} */}
      {/* ////filtertab//// */}

      <FilterTab />

      {/* <button onClick={countFunction}>click</button> */}
      <div
        id="layout"
        className="h-12/12 overflow-auto "
        style={{
          overflow: "scroll",
          height: "100vh",
          Scrollbar: "none",
          scrollbarWidth: "none",
        }}>
        <div
          className="flex w-12/12 rounded-md  bg-white/30 backdrop-blur-sm   shadow-lg mt-1 mb-4 mx-2
     ">
          {/* Info column*/}
          <div className="flex flex-col justify-center items-center text-lg font-sans font-bold p-1  w-full ">
            <div className="flex justify-center items-center py-1 w-full rounded-md my-1  text-white">
              Total leads Assigned : {TotalAssign}
            </div>
          </div>
          {/* Active */}
        </div>
        {Object.entries(Status_count).map(([key, value]) => (
          <AnalyticsComp name={key} value={value} />
        ))}
      </div>

      {/* Action Comp */}
      <div className="fixed w-full h-10 bottom-0 flex justify-center items-center text-sm text-white bg-white/30 backdrop-blur-sm rounded  shadow-lg ">
        copyright©-2023 - Tagore Group of Institutions
      </div>

      {/* <div className="w-12/12 bg-gray-200 rounded overflow-hidden shadow-lg m-4 p-2 ">
        <div className="flex justify-between items-center p-4">
          <div className="font-bold text-lg mb-2">
            Total: {TableData.length}
          </div>
        </div>

        <div>
          <Table
            columns={columns}
            dataSource={TableData}
            rowSelection={{
              selectedRowKeys: selectedRowsKey,

              onChange: (selectedRowKeys, record) => {
                setSelectedRows(record);
                setSelectedRowsKey(selectedRowKeys);
                setNumberOfRows(selectedRowKeys.length);
              },
            }}
          />
        </div>
      </div> */}
    </div>
  );
};
export default MemberAnalyticsDashboard;
