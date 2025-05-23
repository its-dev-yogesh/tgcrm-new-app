import { Button, ColorPicker, Form, Input, Popconfirm, Table, Tag } from "antd";
import { useContext, useEffect, useState } from "react";
import { DatePicker } from "antd";
import Select from "react-select";
// import RegistrationForm from "../../../Froms/RegistrationForm/RegistrationForm";
import { useLocation } from "react-router-dom";
import { FaCheck, FaInfo } from "react-icons/fa";
import { TGCRMContext } from "../../../../Context/Context";
import dayjs from "dayjs";

import axios from "axios";
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

const SourceList = () => {
  const location = useLocation();

  // Access the current pathname, search, and hash
  const { pathname } = location;
  const [form] = Form.useForm();
  const [Path, setPath] = useState("");
  const [OpenFilter, setOpenFilter] = useState(false);

  const [FormData, setFormData] = useState({
    name: [],
    color_code: [],

    created_by: [],

    date_created: [],

    course_fee: [],
  }); // eslint-disable-next-line
  const { getMember, memberData, SourcesData, getSource, GLOBAL_API_URI } =
    useContext(TGCRMContext);
  const [create_date_object, setcreate_date_object] = useState([]);
  const [TableData, setTableData] = useState([]);
  const [Course, setStatus] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [SourceUpdateData, setSourceUpdateData] = useState({
    name: "",
    color_code: "",
  }); // eslint-disable-next-line
  const [editingCell, seteditingCell] = useState("");

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
    get_location(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    const data = memberData.filter((item) => {
      return item.role === "admin";
    });
    console.log("Admins", data);
    setAdminUsers(data); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMember]);

  useEffect(() => {
    setStatus(SourcesData);
    setTableData(SourcesData); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSource]);

  const handleStatusName = (value) => {
    const newData = { ...FormData };
    newData.name = value;
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
  const handleCreatedBy = (value) => {
    const newData = { ...FormData };
    newData.created_by = value;
    setFormData(newData);
  };

  const handleUpdatedname = (value) => {
    const newData = { ...SourceUpdateData };
    newData.name = value.target.value;
    setSourceUpdateData(newData);
  };
  const handleUpdatedColor = (value) => {
    const newData = { ...SourceUpdateData };
    newData.color_code = value.toHexString();
    setSourceUpdateData(newData);
  };

  const columns = [
    {
      title: <div className="flex justify-center font-bold">Source Name</div>,
      width: "15%",
      editable: true,
      render: (_, record) => {
        return record._id === editingCell ? (
          <Input
            value={SourceUpdateData.name}
            onChange={handleUpdatedname}
            className="text-black placeholder:text-black backdrop-blur-sm"
            type="text"
            // placeholder={record.name}
          />
        ) : (
          <div className="flex justify-start">
            <Tag color={record.color_code}>{record.name}</Tag>
          </div>
        );
      },
    },
    {
      title: <div className="flex justify-center font-bold">Source Code</div>,
      dataIndex: "color_code",
      width: "10%",
      editable: true,
      render: (_, record) => {
        return record._id === editingCell ? (
          <div className="flex justify-evenly items-center gap-2 ">
            <Tag
              color={record.color_code}
              className="flex items-center justify-center  text-white font-bold  h-7 rounded-md">
              {record.color_code}
            </Tag>
            <ColorPicker
              onChange={handleUpdatedColor}
              value={SourceUpdateData.color_code}
              className="text-white placeholder:text-black backdrop-blur-sm "
              type="text"
              placeholder={record.color_code}
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <Tag color={record.color_code}>{record.color_code}</Tag>
          </div>
        );
      },
    },

    {
      title: <div className="flex  font-bold">Created By</div>,
      dataIndex: "created_by",
      widthL: "10%",
      editable: true,
    },
    {
      title: <div className="flex  font-bold">Created Date</div>,
      dataIndex: "date_created",

      editable: true,
    },
    {
      title: <div className="flex justify-center font-bold">Action</div>,
      dataIndex: "action",
      width: "15%",
      render: (_, record) => {
        return editingCell === record._id ? (
          <div className="flex justify-center">
            <Tag
              color="orange"
              className=" items-center hover:cursor-pointer"
              onClick={() => UpdateStatus(record._id)}>
              Save
            </Tag>{" "}
            <Tag
              className=" hover:cursor-pointer"
              onClick={() => {
                seteditingCell("");
              }}>
              Cancel
            </Tag>{" "}
          </div>
        ) : (
          <div className="flex justify-center">
            <Tag
              className="font-bold hover:cursor-pointer"
              color="blue"
              onClick={() => getEditingCell(record)}>
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
        );
      },
    },
  ];
  let getEditingCell = (record) => {
    let newdata = { ...SourceUpdateData };
    newdata.name = record.name;
    newdata.color_code = record.color_code;
    setSourceUpdateData(newdata);
    seteditingCell(record._id);
  };
  function convertObjectValuesToLowercase(obj) {
    const lowercaseObj = Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = typeof value === "string" ? value.toLowerCase() : value;
      return acc;
    }, {});

    return lowercaseObj;
  }

  let UpdateStatus = async (recordId) => {
    let data = { ...SourceUpdateData };
    const recordData = {
      _id: recordId,
      name: data.name,
      color_code: data.color_code,
    };
    let lowercaseRecord = convertObjectValuesToLowercase(recordData);
    if (recordData.name) {
      try {
        const statusUpdateResponse = await axios.post(
          `${GLOBAL_API_URI}update-source`,
          lowercaseRecord
        );
        if (statusUpdateResponse) {
          getSource();
          seteditingCell("");
          alert("Source Updated");
        }
      } catch (error) {
        alert(error);
      }
    } else {
      alert("Source Cannot be Empty");
    }

    console.log(recordId);
  };

  const handleDelete = async (Data_Key) => {
    try {
      const deleteStatus = {
        documentId: Data_Key,
      }; // eslint-disable-next-line
      const response = await fetch(`https://tgcrm-new-api.vercel.app//delete-source`, {
        method: "POST",
        body: JSON.stringify(deleteStatus),
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Status deleted");
      getSource();
    } catch (error) {
      console.log(error);
    }

    getSource();
  };

  ///////////////handle filter toggle /////////////
  const handlefilterToggle = () => {
    setOpenFilter(!OpenFilter);
  };
  ///////////////handle Registration Toggle /////////////

  /////////////////////Member Registration Form////////////////////////////////

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
  const created_by_options = adminUsers.map((item) => ({
    value: item.full_name.toLowerCase(),
    label: item.full_name,
  }));
  const course_name_options = SourcesData.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  let filtername = FormData.name.map((item) => {
    return item.value.toLowerCase();
  });
  let filtercolor_code = FormData.color_code.map((item) => {
    return item.value;
  });
  let filtercreated_by = FormData.created_by.map((item) => {
    return item.value;
  });
  const handleFilter = () => {
    setTableData(filterMembers());
  };
  const handleReset = () => {
    setTableData(SourcesData);
    const newData = {
      name: [],
      color_code: [],

      created_by: [],

      date_created: [],

      course_fee: [],
    };
    setcreate_date_object([]);
    setFormData(newData);
  };
  const filterMembers = () => {
    return Course.filter(
      (item) =>
        (!filtername.length > 0 || filtername.includes(item.name)) &&
        (!filtercolor_code.length > 0 ||
          filtercolor_code.includes(item.color_code)) &&
        (!filtercreated_by.length > 0 ||
          filtercreated_by.includes(item.created_by)) &&
        (!create_date_object ||
          dayjs(item.date_created, "DD-MM-YYYY").isBetween(
            dayjs(FormData.date_created[0], "DD-MM-YYYY"),
            dayjs(FormData.date_created[1], "DD-MM-YYYY"),
            "DD-MM-YYYY",
            "[]"
          ))
    );
  };
  const FilterTab = () => {
    return (
      <div className="w-12/12  bg-gray-200 rounded shadow-lg m-4">
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
              <span>Status Filter :</span>
            </div>

            <div className="flex flex-row justify-between mb-2 w-full flex-wrap">
              <div className="  flex flex-col justify-between flex-grow">
                <div className="flex  flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white pl-2 font-bold p-1">
                    Status Name:
                  </label>
                  <Select
                    onChange={handleStatusName}
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
                    options={course_name_options}
                    classNamePrefix="select"
                  />
                </div>
              </div>

              <div className="  flex flex-col justify-between flex-grow">
                <div className="flex  flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white pl-2 font-bold p-1">
                    Created By:
                  </label>
                  <Select
                    onChange={handleCreatedBy}
                    value={FormData.created_by}
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
                    options={created_by_options}
                    classNamePrefix="select"
                  />
                </div>
              </div>
              <div className="  flex flex-col justify-between flex-grow">
                <div className="flex  flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white pl-2 font-bold p-1">
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
      <FilterTab />
      <div className="w-12/12 bg-gray-200 rounded overflow-hidden shadow-lg m-4 p-2">
        <div className="flex justify-between items-center p-4">
          <div className="font-bold text-lg mb-2">
            Total: {TableData.length}
          </div>
          {/* <button
            onClick={handleRegToggle}
            className="flex justify-center w-20 bg-Primary hover:opacity-50 text-xl  text-white  p-1 border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded"
          >
            {OpenRegForm ? <span>X</span> : <span>Add</span>}
          </button> */}
        </div>

        <div>
          <Form form={form} component={false}>
            <Table
              bordered
              dataSource={TableData}
              columns={columns}
              rowClassName="editable-row"
            />
          </Form>
        </div>
      </div>
    </div>
  );
};
export default SourceList;
