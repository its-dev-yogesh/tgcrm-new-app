import {
  Button,
  Form,
  Input,
  InputNumber,
  Table,
  Tag,
  Modal,
  Popconfirm,
} from "antd";
import dayjs from "dayjs";

import Select from "react-select";
import { useContext, useEffect, useState } from "react";
import { DatePicker } from "antd";

import { Link, useLocation } from "react-router-dom";
import { FaCheck, FaInfo } from "react-icons/fa";
import { TGCRMContext } from "../../../../Context/Context";

import RegistrationForm from "../../../Froms/RegistrationForm/RegistrationForm";
import MemberUpdationForm from "../../../Froms/RegistrationForm/MemberUpdationForm";
import { useTestApi } from "../../../../services/getleads";
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
const MemberList = () => {
  const location = useLocation();
  const { getMember, memberData } = useContext(TGCRMContext);
  const [Users, setUsers] = useState([]);
  const [assignedMembers, setassignedMembers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  // Access the current pathname, search, and hash
  const { pathname } = location;
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [Path, setPath] = useState("");
  const [OpenFilter, setOpenFilter] = useState(false);
  const [OpenRegForm, setOpenRegForm] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [TableData, setTableData] = useState([]);
  const [date, setDate] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [PofileCard, setPofileCard] = useState(false);
  const [create_date_object, setcreate_date_object] = useState([]);
  const { testApiHit, isLoading } = useTestApi();
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
    const strAscending = [...memberData].sort((a, b) =>
      a.full_name > b.full_name ? 1 : -1
    );
    setUsers(memberData);
    setTableData(strAscending);

    const data = memberData.filter((item) => {
      return item.role === "admin";
    });
    console.log("Admins", data);
    setAdminUsers(data);
    setPofileCard(false);
  }, [getMember]);

  const onSubmit = () => {
    testApiHit(
      { name: "yogesh" },
      {
        onSuccess: (data) => {
          alert(data?.data);
        },
      }
    );
  };

  const handleFullName = (select) => {
    const newData = { ...FormData };
    newData.full_name = select;

    setFormData(newData);
  };

  const handleGender = (e) => {
    const newData = { ...FormData };
    newData.gender = e;
    setFormData(newData);
  };

  const handleEmail = (e) => {
    const newData = { ...FormData };
    newData.email = e;
    setFormData(newData);
  };

  const handlePhoneNo = (e) => {
    const newData = { ...FormData };
    newData.phone_no = e;
    setFormData(newData);
  };

  const handleFathersName = (e) => {
    const newData = { ...FormData };
    newData.fathers_name = e;
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

  const handleBranchPosition = (e) => {
    const newData = { ...FormData };
    newData.branch_position = e;
    setFormData(newData);
  };

  const handleDateCreated = (date, dateString) => {
    console.log("date Created", dateString);
    const newData = { ...FormData };
    newData.date_created = dateString;
    setFormData(newData);
    setcreate_date_object(date);
    console.log("date Created", dateString);
  };

  const handleAssignedUnder = (e) => {
    const newData = { ...FormData };
    newData.assigned_under = e;
    setFormData(newData);
  };

  const handleAssignedBy = (e) => {
    const newData = { ...FormData };

    newData.assigned_by = e;
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
      dataIndex: "full_name",
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.full_name}</span>
            <Tag
              className="font-bold text-sm"
              color={
                record.role === "admin"
                  ? "blue"
                  : record.role === "manager"
                  ? "green"
                  : "red"
              }>
              {record.role}
            </Tag>
          </>
        );
      },
      fixed: "left",
    },

    {
      title: <span className="font-bold">Email</span>,
      dataIndex: "email",
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">Phone No.</span>,
      dataIndex: "phone_no",
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">Father's Name</span>,
      dataIndex: "fathers_name",

      editable: true,
    },
    {
      title: <span className="font-bold">DOB</span>,
      dataIndex: "dob",

      editable: true,
    },
    {
      title: <span className="font-bold">Branch and Position</span>,
      dataIndex: "branch_position",

      editable: true,
    },
    {
      title: <span className="font-bold">Date Created</span>,
      dataIndex: "date_created",

      editable: true,
    },
    {
      title: <span className="font-bold">Created By</span>,
      dataIndex: "assigned_by",

      editable: true,
      // render: (_, record) => {
      //   return Users.map((item) => {
      //     if (item._id === record.assigned_by) return item.full_name;
      //   });
      // },
    },
    {
      title: <span className="font-bold">Assigned Under</span>,
      dataIndex: "assigned_under",

      editable: true,
    },
    {
      title: <span className="font-bold">Gender</span>,
      dataIndex: "gender",

      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => (
        <div className="flex justify-center">
          <Tag
            className="font-bold hover:cursor-pointer"
            color="blue"
            onClick={() => {
              handleProfileButton(record);
            }}>
            Edit
          </Tag>{" "}
          <Popconfirm
            onConfirm={() => {
              handleDelete(record._id);
            }}
            title="Delete the task"
            description="Are you sure to delete this task?"
            icon={<FaInfo color="red" />}
            okButtonProps={<Button type="primary" />}>
            <Tag className=" hover:cursor-pointer" color="red">
              Delete
            </Tag>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const handleProfileButton = (record) => {
    // console.log(record);
    setProfileData(record);
    setPofileCard(true);
  };
  const handleDelete = async (record_id) => {
    try {
      const deleteMember = {
        documentId: record_id,
      }; // eslint-disable-next-line
      const response = await fetch(`https://tgcrm-new-api.vercel.app//delete-member`, {
        method: "POST",
        body: JSON.stringify(deleteMember),
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Member deleted");
      getMember();
    } catch (error) {
      console.log(error);
    }

    getMember();
  };
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
  /////////////////////Member Registration Form////////////////////////////////
  const RegForm = () => {
    return <RegistrationForm />;
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
  const admin_options = adminUsers.map((item) => ({
    value: item.full_name,
    label: item.full_name,
  }));
  const fathers_name_options = Users.map((item) => ({
    value: item.fathers_name,
    label: item.fathers_name,
  }));
  const branch_options = Users.map((item) => ({
    value: item.branch_position,
    label: item.branch_position,
  }));
  const phone_options = Users.map((item) => ({
    value: item.phone_no,
    label: item.phone_no,
  }));
  const email_options = Users.map((item) => ({
    value: item.email,
    label: item.email,
  }));
  const address_options = Users.map((item) => ({
    value: item.address,
    label: item.address,
  }));
  let filtername = FormData.full_name.map((item) => {
    return item.value.toLowerCase();
  });
  let filterRole = FormData.role.map((item) => {
    return item.value;
  });
  let filterbranch_position = FormData.branch_position.map((item) => {
    return item.value;
  });
  let filterfathers_name = FormData.fathers_name.map((item) => {
    return item.value;
  });
  let filteremail = FormData.email.map((item) => {
    return item.value;
  });
  let filterPhone = FormData.phone_no.map((item) => {
    return item.value;
  });
  let filterassigned_under = FormData.assigned_under.map((item) => {
    return item.value.toLowerCase();
  });
  let filterassigned_by = FormData.assigned_by.map((item) => {
    return item.value.toLowerCase();
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
    const lowercaseArray = convertArrayValuesToLowercase(filterMembers());
    setTableData(lowercaseArray);
  };
  const handleReset = () => {
    setTableData(Users);
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

  const rep = (Users) => {
    setassignedMembers(Users);
    const updatedMembers = Users.map((record) => {
      const assignedById = record.assigned_by;
      const assignedUser = Users.find((item) => item._id === assignedById);

      if (assignedUser) {
        record.assigned_by = assignedUser.full_name;
      }

      return record;
    });
    setTableData(updatedMembers);
    return updatedMembers;
  };
  const filterMembers = () => {
    return Users.filter(
      (item) =>
        (!filterRole.length > 0 || filterRole.includes(item.role)) &&
        (!filtername.length > 0 || filtername.includes(item.full_name)) &&
        (!filterfathers_name.length > 0 ||
          filterfathers_name.includes(item.fathers_name)) &&
        (!filterPhone.length > 0 || filterPhone.includes(item.phone_no)) &&
        (!filteremail.length > 0 || filteremail.includes(item.email)) &&
        (!filterassigned_by.length > 0 ||
          filterassigned_by.includes(item.assigned_by)) &&
        (!filterassigned_under.length > 0 ||
          filterassigned_under.includes(item.assigned_under)) &&
        (!filterbranch_position.length > 0 ||
          filterbranch_position.includes(item.branch_position)) &&
        (!filteraddress.length > 0 || filteraddress.includes(item.address)) &&
        (!filtergender.length > 0 || filtergender.includes(item.gender)) &&
        (!FormData.dob > 0 || FormData.dob === item.dob) &&
        (!create_date_object ||
          dayjs(item.date_created, "DD-MM-YYYY").isBetween(
            dayjs(FormData.date_created[0], "DD-MM-YYYY"),
            dayjs(FormData.date_created[1], "DD-MM-YYYY"),
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
  const FilterTab = () => {
    return (
      <div className="w-12/12  bg-gray-200 rounded  shadow-lg m-4 ">
        <div className=" flex flex-row justify-between px-6 py-4">
          <div className="font-bold text-xl mb-2">{Path}</div>
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
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Role:</label>

                  <Select
                    onChange={handleRole}
                    value={FormData.role}
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
                    options={role_options}
                    classNamePrefix="select"
                  />
                </div>
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
                {/* branch and Position */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">
                    Branch Position:
                  </label>
                  <Select
                    onChange={handleBranchPosition}
                    value={FormData.branch_position}
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
                    options={branch_options}
                    classNamePrefix="select"
                  />
                </div>
                {/* assingned_under */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">
                    Assigned Under:
                  </label>
                  <Select
                    onChange={handleAssignedUnder}
                    value={FormData.assigned_under}
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
                {/* Phone No. */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Phone No:</label>
                  <Select
                    onChange={handlePhoneNo}
                    value={FormData.phone_no}
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
                {/* Email */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Email:</label>
                  <Select
                    onChange={handleEmail}
                    value={FormData.email}
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
                    options={email_options}
                    classNamePrefix="select"
                  />
                </div>
                {/* /////////////Assigned by */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">
                    Assigned By:
                  </label>
                  <Select
                    onChange={handleAssignedBy}
                    value={FormData.assigned_by}
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
                    options={admin_options}
                    classNamePrefix="select"
                  />
                </div>

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
              <div className="  flex flex-col justify-between flex-grow">
                {/* Fathers Name */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">
                    Father's Name:
                  </label>
                  <Select
                    onChange={handleFathersName}
                    value={FormData.fathers_name}
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
                    options={fathers_name_options}
                    classNamePrefix="select"
                  />
                </div>
                {/* Address */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Address:</label>
                  <Select
                    onChange={handleAddress}
                    value={FormData.address}
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
                    options={address_options}
                    classNamePrefix="select"
                  />
                </div>
                {/* /////////////DOB */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label htmlFor="dob" className="text-white font-bold p-1">
                    Date of Birth:
                  </label>

                  <DatePicker
                    onChange={handleDOB}
                    value={date}
                    format={"DD-MM-YYYY"}
                    className="rounded-r-md pr-3  text-2xl bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none"
                  />
                </div>
                {/* /////////////Gender */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Gender:</label>
                  <Select
                    onChange={handleGender}
                    value={FormData.gender}
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
                    options={gender_options}
                    classNamePrefix="select"
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
      <Modal
        centered
        open={PofileCard}
        okButtonProps={false}
        cancelButtonProps={false}
        // onOk={() => setPofileCard(false)}
        onCancel={() => setPofileCard(false)}
        width={1000}
        footer={null}>
        <MemberUpdationForm {...profileData} />
      </Modal>
      <FilterTab />
      <div className="w-12/12 bg-gray-200 rounded overflow-hidden shadow-lg m-4 p-2 ">
        <div className="flex justify-between items-center p-4">
          <div className="font-bold text-lg mb-2">
            Total: {TableData.length}
          </div>
          {/* <button
            onClick={() => {
              console.log(FormData);
            }}
            className="flex justify-center w-20 bg-Primary hover:opacity-50 text-xl  text-white  p-1 border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded"
          >
            {OpenRegForm ? <span>X</span> : <span>Add</span>}
          </button> */}
        </div>

        {/* {OpenRegForm && (
          <div
            className={`  duration-1000 ${
              OpenRegForm ? "opacity-100" : "opacity-0"
            }  `}
          >
            <RegForm />
          </div>
        )} */}
        <div>
          <Form form={form} component={false}>
            <button onClick={onSubmit}> click me </button>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={TableData}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                onChange: cancel,
              }}
              scroll={{ x: "calc(700px + 50%)" }}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};
export default MemberList;
