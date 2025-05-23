import React, { useContext, useEffect, useState } from "react";
import { message } from "antd";
import "./index.css";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { TGCRMContext } from "../../../Context/Context";
import dayjs from "dayjs";
const StatusRegForm = () => {
  const { getMember, memberData, AuthUser, getStatus } =
    useContext(TGCRMContext);

  const [isReg, setisReg] = useState(true);
  // eslint-disable-next-line

  const [FormData, setFormData] = useState({
    name: "",
    color_code: "",

    created_by: "",

    date_created: "",

    admin_count: "",
    followup_count: "",
  }); // eslint-disable-next-line
  useEffect(() => {
    setInterval(() => {
      setisReg(false);
    }, 2000);
  }, []);
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      content: (
        <div className="flex flex-col gap-3">
          <div className=" flex justify-start items-center text-lg">
            <div className=" w-6 h-6 text-white flex text-base items-center justify-center rounded-full bg-green-600 mr-2">
              <FaCheck />
            </div>
            <div className=" text-green-600"> Status Added Successfully</div>
          </div>
        </div>
      ),
      className: "mt-10",
      icon: null,
    });
  };
  const error = () => {
    messageApi.open({
      content: (
        <div className="flex flex-col gap-3">
          <div className=" flex justify-start items-center text-lg">
            <div className=" w-6 h-6 text-white flex text-base items-center justify-center rounded-full bg-red-600 mr-2">
              X
            </div>
            <div className="font-bold text-red-600"> Member Adding Failed </div>
          </div>
          <div className="text-md font-bold">
            {" "}
            Status with name
            <span className="text-red-700 mr-1 ml-1 font-bold">
              {FormData.name}
            </span>
            already exist{" "}
          </div>
        </div>
      ),
      className: "mt-10",
      icon: null,
    });
  };

  const handleStatusName = (e) => {
    const newData = { ...FormData };
    newData.name = e.target.value;
    setFormData(newData);
  };

  const handleStatusColor = (e) => {
    console.log();
    const newData = { ...FormData };
    newData.color_code = e.target.value;
    setFormData(newData);
  };

  const handleadmin_count = (e) => {
    const newData = { ...FormData };
    newData.admin_count = e.target.value;
    setFormData(newData);
  };
  const handlefollowup_count = (e) => {
    const newData = { ...FormData };
    newData.followup_count = e.target.value;
    setFormData(newData);
  };

  const isFormValid = () => {
    return (
      FormData.name &&
      FormData.color_code &&
      FormData.admin_count &&
      FormData.followup_count
    );
  };
  function convertObjectValuesToLowercase(obj) {
    const lowercaseObj = Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = typeof value === "string" ? value.toLowerCase() : value;
      return acc;
    }, {});

    return lowercaseObj;
  }
  const handleSubmit = async (e) => {
    const newData = { ...FormData };
    newData.created_by = `${AuthUser.full_name}`;

    newData.date_created = dayjs().format("DD-MM-YYYY");
    const lowercaseObject = convertObjectValuesToLowercase(newData);
    try {
      setisReg(true);

      const response = await fetch("https://tgcrm.vercel.app/status", {
        method: "POST",
        body: JSON.stringify(lowercaseObject),
        headers: {
          "Content-Type": "application/json",
        },
      });

      let statusData;
      if (response.ok) {
        statusData = await response.json();

        if (statusData) {
          console.log("Suceessfully added status", newData);
          success();

          getStatus();
          setFormData({
            name: "",
            color_code: "",
            admin_count: "",
            followup_count: "",
          });
        }
      } else if (response.status === 400) {
        error();
      } else {
        error();
      }
      setisReg(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  let RegButton;
  if (isReg === false) {
    RegButton = (
      <button
        type="submit"
        className={`w-60 flex  flex-row justify-center bg-Primary   text-xl  text-white  mr-2 p-2  hover:border-Primary hover:border-opacity-80 rounded-xl ${
          !isFormValid() ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
        }
        `}
        // disabled={!isFormValid()}
        onClick={handleSubmit}
        disabled={!isFormValid()}>
        Add Status<i className="fa-solid fa-house"></i>
      </button>
    );
  } else {
    RegButton = (
      <button
        // disabled
        type="submit"
        // type="button"
        onClick={() => {
          setisReg(!isReg);
        }}
        className={`w-60 flex  flex-row justify-center items-center bg-Primary  hover:opacity-80 text-xl  text-white  mr-2 p-2  hover:border-Primary hover:border-opacity-80 rounded-xl opacity-50 cursor-not-allowed`}>
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
        Adding Status...
      </button>
    );
  }
  return (
    <div className={`bg-white flex flex-col p-2 mb-5 w-12/12 m-4 rounded-xl`}>
      <div className="font-bold text-xl m-2 ">
        <span>Status Registration :</span>
      </div>
      {contextHolder}

      <div className="flex flex-row justify-between mb-2 w-full flex-wrap">
        <div className="flex flex-row justify-between mb-2 w-full flex-wrap">
          <div className="  flex flex-col justify-between flex-grow">
            <div className="flex  flex-row justify-between m-2 bg-slate-600 rounded-md">
              <label className="text-white pl-2 font-bold p-1">
                Status Name:
              </label>
              <input
                className={
                  FormData.name.length === 0
                    ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-7/12 font-bold pl-1 focus:outline-none`
                    : FormData.name.length < 2
                    ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                    : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                }
                onChange={handleStatusName}
                value={FormData.name}
                name="name"
                type="text"
              />
            </div>
            <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
              <label className="text-white font-bold pl-2 p-1">
                Count for Followup:
              </label>

              <select
                className={
                  FormData.followup_count.length === 0
                    ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-7/12 font-bold pl-1 focus:outline-none`
                    : FormData.followup_count.length < 2
                    ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                    : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                }
                onChange={handlefollowup_count}
                value={FormData.followup_count}
                name="role">
                <option value="">Count For FollowUp</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>

                {/* Add more options as needed */}
              </select>
            </div>
          </div>
          <div className="  flex flex-col justify-between flex-grow">
            <div className="flex  flex-row justify-between m-2 bg-slate-600 rounded-md">
              <label
                // style={{ background: `${FormData.color_code}` }}
                className="text-white pl-2 font-bold p-1">
                Status Color:
              </label>
              <div
                className={
                  FormData.color_code.length === 0
                    ? "flex bg-slate-200 p1 border-r-8 h-full border-yellow-500  w-7/12 font-bold pl-1 decoration-none focus:outline-none"
                    : FormData.color_code.length < 2
                    ? "flex bg-slate-200 p1 border-r-8 h-full border-red-500  w-7/12 font-bold pl-1 decoration-none focus:outline-none"
                    : "flex bg-slate-200 p1 border-r-8 h-full border-green-500  w-7/12 font-bold pl-1 decoration-none focus:outline-none"
                }>
                <input
                  type="color"
                  className=" bg-slate-200 p1  h-full  w-10/12 font-bold pl-1 decoration-none focus:outline-none"
                  onChange={handleStatusColor}
                />
                <span
                  style={{ background: `${FormData.color_code}` }}
                  className="flex border-2 text-white  items-center justify-center w-32">
                  {FormData.color_code}
                </span>
              </div>
            </div>
          </div>
          <div className="  flex flex-col justify-between flex-grow">
            <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
              <label className="text-white font-bold pl-2 p-1">
                Count for Active:
              </label>

              <select
                className={
                  FormData.admin_count.length === 0
                    ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-7/12 font-bold pl-1 focus:outline-none`
                    : FormData.admin_count.length < 2
                    ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                    : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                }
                onChange={handleadmin_count}
                value={FormData.admin_count}
                name="role">
                <option value="">Count For Active</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>

                {/* Add more options as needed */}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center">{RegButton}</div>
    </div>
  );
};
export default StatusRegForm;
