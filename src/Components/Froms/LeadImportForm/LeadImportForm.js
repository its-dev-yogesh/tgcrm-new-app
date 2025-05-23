import React, { useContext, useRef, useState } from "react";
import { message } from "antd";
import { FaCheck } from "react-icons/fa";
import { TGCRMContext } from "../../../Context/Context";
import moment from "moment";
import Papa from "papaparse";
const LeadImportForm = () => {
  const inputRef = useRef(null);
  const { getLeads, AuthUser } = useContext(TGCRMContext);

  const [isReg, setisReg] = useState(false);
  const [showReview, setshowReview] = useState(false);

  // eslint-disable-next-line
  // const [NewFormData, setNewFormData] = useState({
  //   full_name: "",
  //   first_name: "",
  //   last_name: "",
  //   gender: "",
  //   email: "",
  //   phone_no: "",
  //   fathers_name: "",
  //   dob: "",
  //   role: "",
  //   branch_position: "",
  //   date_created: moment().format("DD-MM-YYYY"),
  //   assigned_under: "",
  //   assigned_by: `${AuthUser.full_name}`,
  //   address: "",
  //   password: "",
  // }); // eslint-disable-next-line
  const [parsedData, setParsedData] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      content: (
        <div className="flex flex-col gap-3">
          <div className=" flex justify-start items-center text-lg">
            <div className=" w-6 h-6 text-white flex text-base items-center justify-center rounded-full bg-green-600 mr-2">
              <FaCheck />
            </div>
            <div className=" text-green-600"> Leads Imported Successfully</div>
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
            <div className="font-bold text-red-600">
              {" "}
              Leads Importing Failed. Try again!{" "}
            </div>
          </div>
        </div>
      ),
      className: "mt-10",
      icon: null,
    });
  };

  const isFormValid = () => {
    return parsedData.length > 2;
  };
  // function convertObjectValuesToLowercase(obj) {
  //   const lowercaseObj = Object.entries(obj).reduce((acc, [key, value]) => {
  //     acc[key] = typeof value === "string" ? value.toLowerCase() : value;
  //     return acc;
  //   }, {});

  //   return lowercaseObj;
  // }
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
  const handleSubmit = async (e) => {
    const newdata = [...parsedData];
    const lowercaseArr = convertArrayValuesToLowercase(newdata);
    // console.log(
    //   "🙏 ~ file: LeadImportForm.js:97 ~ handleSubmit ~ lowercaseArr:",
    //   lowercaseArr
    // );

    try {
      setisReg(true);

      const response = await fetch("https://tgcrm-new-api.vercel.app//leads", {
        method: "POST",
        body: JSON.stringify(lowercaseArr),
        headers: {
          "Content-Type": "application/json",
        },
      });

      let leadResponse;
      if (response.ok) {
        leadResponse = await response.json();

        if (leadResponse) {
          console.log("Suceessfully added", lowercaseArr);
          success();
          getLeads();
          resetFileUpload();
          setshowReview(!showReview);
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
        Import Leads<i className="fa-solid fa-house"></i>
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
        Importing Leads...
      </button>
    );
  }

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    event.target.files[0] &&
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          const rowsArray = [];
          const valuesArray = [];

          // Iterating data to get column name and their values
          // eslint-disable-next-line
          results.data.map((d) => {
            rowsArray.push(Object.keys(d));
            valuesArray.push(Object.values(d));
          });
          const arr = results.data.map((obj) => ({
            ...obj,
            assigned_info: [{ to: `${AuthUser.full_name}`, assigned_seq: 1 }],
            status: "Fresh",
            assigned_to: `${AuthUser.full_name.toLowerCase()}`,
            date: moment().format("DD-MM-YYYY"),
            modified_date: moment().format("DD-MM-YYYY"),
            action: "No Response",
            day: "",
            color: "red",
            progressPercent: 0,
            tagcolor: "blue",
            comment: "",
            previous_status: "Fresh",
          }));
          const uniqueMobiles = Array.from(
            new Set(arr.map((item) => item.mobile))
          );

          const filteredData = uniqueMobiles.map((mobile) => {
            return arr.find((item) => item.mobile === mobile);
          });

          setParsedData(filteredData);
          // console.log("Unique Data:", filteredData);
          // Display duplicate data in the console
          // const duplicateData = uniqueMobiles.map((mobile) => {
          //   return arr.find((item) => item.mobile === mobile);
          // });
          // console.log("Duplicate Data:", duplicateData);
        },
      });
  };
  const resetFileUpload = () => {
    setParsedData([]);
    inputRef.current.value = null;
  };

  const leadForm = (
    <div className={`bg-white flex flex-col p-2 mb-5  rounded-xl w-12/12 m-4`}>
      <div className="font-bold text-xl m-2 ">
        <span>Lead Import :</span>
      </div>
      {/* <button onClick={resetFileUpload}> click me</button> */}
      {contextHolder}

      <div className="flex flex-row justify-start mb-2 w-full flex-wrap">
        <div className="flex flex-row justify-between m-2 pl-2 w-4/12 bg-slate-600 rounded-md">
          <label className="text-white font-bold p-1">
            Total Unique Leads : {parsedData.length}
          </label>
        </div>
        <div>
          <input
            ref={inputRef}
            className={
              parsedData.length === 0
                ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-auto h-auto font-bold pl-1 focus:outline-none `
                : parsedData.length < 10
                ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-auto h-auto  font-bold pl-1 focus:outline-none`
                : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-auto h-auto  font-bold pl-1 focus:outline-none`
            }
            type="file"
            name="file"
            onChange={changeHandler}
            accept=".csv"
            style={{ display: "block", margin: "10px auto" }}
          />
        </div>
      </div>

      <div className="flex justify-end items-center">
        <div>{RegButton}</div>
      </div>
    </div>
  );

  return <>{leadForm}</>;
};
export default LeadImportForm;
