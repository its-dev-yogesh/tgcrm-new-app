import React, { useContext, useEffect, useState } from "react";
import { Alert, DatePicker, message } from "antd";
import { FaEye, FaEyeSlash, FaCut, FaCheck } from "react-icons/fa";
import { TGCRMContext } from "../../../Context/Context";
import moment from "moment";
import dayjs from "dayjs";
const MemberUpdationForm = (props) => {
  const { getMember, memberData, AuthUser } = useContext(TGCRMContext);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isReg, setisReg] = useState(false);
  const [showReview, setshowReview] = useState(false);
  const [Members, setMembers] = useState([]);
  // eslint-disable-next-line
  const [NewFormData, setNewFormData] = useState({
    _id: "",
    full_name: "",
    gender: "",
    email: "",
    phone_no: "",
    fathers_name: "",
    dob: "",
    role: "",
    branch_position: "",
    date_created: moment().format("DD-MM-YYYY"),
    assigned_under: "",
    assigned_by: `${AuthUser.full_name}`,
    address: "",
    password: "",
    assigned_info: [],
  }); // eslint-disable-next-line
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    const tempdata = { ...NewFormData };
    tempdata._id = props._id;
    tempdata.gender = props.gender;
    tempdata.full_name = props.full_name;
    tempdata.dob = dayjs(props.dob, "DD-MM-YYYY");
    tempdata.role = props.role;
    tempdata.address = props.address;
    tempdata.password = props.password;
    tempdata.email = props.email;
    tempdata.phone_no = props.phone_no;
    tempdata.branch_position = props.branch_position;
    tempdata.fathers_name = props.fathers_name;
    tempdata.assigned_under = props.assigned_under;
    setNewFormData(tempdata);
  }, [props]);
  const success = () => {
    messageApi.open({
      content: (
        <div className="flex flex-col gap-3">
          <div className=" flex justify-start items-center text-lg">
            <div className=" w-6 h-6 text-white flex text-base items-center justify-center rounded-full bg-green-600 mr-2">
              <FaCheck />
            </div>
            <div className=" text-green-600"> Member Updated Successfully</div>
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
              Member Updation Failed
            </div>
          </div>
          <div className="text-md font-bold">
            Email
            <span className="text-red-700 mr-1 ml-1 font-bold">
              {NewFormData.email}
            </span>
            already exist
          </div>
        </div>
      ),
      className: "mt-10",
      icon: null,
    });
  };

  useEffect(() => {
    setMembers(memberData);
  }, [getMember]);

  const handleFirstName = (e) => {
    const newData = { ...NewFormData };
    newData.first_name = e.target.value;
    setNewFormData(newData);
  };

  const handleLastName = (e) => {
    const newData = { ...NewFormData };
    newData.last_name = e.target.value;
    setNewFormData(newData);
  };

  const handleGender = (e) => {
    const newData = { ...NewFormData };
    newData.gender = e.target.value;
    setNewFormData(newData);
  };
  const handleEmail = (e) => {
    const newData = { ...NewFormData };
    newData.email = e.target.value;

    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailPattern.test(e.target.value)) {
      setEmailError("Invalid email");
      setNewFormData(newData);
    } else {
      setEmailError("");
      setNewFormData(newData);
    }
  };

  const handlePhoneNo = (e) => {
    const newData = { ...NewFormData };
    newData.phone_no = e.target.value;
    setNewFormData(newData);
  };

  const handleFathersName = (e) => {
    const newData = { ...NewFormData };
    newData.fathers_name = e.target.value;
    setNewFormData(newData);
  };

  const handleDOB = (date) => {
    const newData = { ...NewFormData };
    newData.dob = date;
    setNewFormData(newData);
  };

  const handleRole = (e) => {
    const newData = { ...NewFormData };
    newData.role = e.target.value;
    setNewFormData(newData);
  };

  const handleBranchPosition = (e) => {
    const newData = { ...NewFormData };
    newData.branch_position = e.target.value;
    setNewFormData(newData);
  };

  const handleDateCreated = (e) => {
    const newData = { ...NewFormData };
    newData.date_created = e.target.value;
    setNewFormData(newData);
  };

  const handleAssignedUnder = (e) => {
    const newData = { ...NewFormData };
    newData.assigned_under = e.target.value;
    setNewFormData(newData);
  };

  const handleAssignedBy = (e) => {
    const newData = { ...NewFormData };
    newData.assigned_by = e.target.value;
    setNewFormData(newData);
  };

  const handleAddress = (e) => {
    const newData = { ...NewFormData };
    newData.address = e.target.value;
    setNewFormData(newData);
  };

  const handlePassword = (e) => {
    const newData = { ...NewFormData };
    newData.password = e.target.value;

    if (e.target.value.length < 8) {
      setPasswordError("Invalid password");
      setNewFormData(newData);
    } else {
      setPasswordError("");
      setNewFormData(newData);
    }
  };
  const isFormValid = () => {
    return (
      NewFormData.email &&
      NewFormData.password &&
      !emailError &&
      !passwordError &&
      NewFormData.assigned_under &&
      NewFormData.dob &&
      NewFormData.phone_no &&
      NewFormData.branch_position &&
      NewFormData.role &&
      NewFormData.fathers_name &&
      NewFormData.gender
    );
  };
  function convertObjectValuesToLowercase(obj) {
    const lowercaseObj = Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = typeof value === "string" ? value.toLowerCase() : value;
      return acc;
    }, {});

    return lowercaseObj;
  }
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
  const handleSubmit = async (e) => {
    const newData = { ...NewFormData };

    newData.dob = JSON.stringify(newData.dob)
      .slice(1, 11)
      .split("-")
      .reverse()
      .join("-");
    const lowercaseObject = convertObjectValuesToLowercase(newData);
    lowercaseObject.password = toCamelCase(lowercaseObject.password);
    try {
      setisReg(true);

      const response = await fetch("https://tgcrm-new-api.vercel.app/update-member", {
        method: "POST",
        body: JSON.stringify(lowercaseObject),
        headers: {
          "Content-Type": "application/json",
        },
      });

      let memberData;
      if (response.ok) {
        memberData = await response.json();

        if (memberData) {
          console.log("Suceessfully added", newData);
          success();
          getMember();
          setNewFormData({
            first_name: "",
            last_name: "",
            gender: "",
            email: "",
            phone_no: "",
            fathers_name: "",
            dob: "",
            role: "",
            branch_position: "",
            date_created: "",
            assigned_under: "",
            assigned_by: "",
            address: "",
            password: "",
          });
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
        Confirm Submission<i className="fa-solid fa-house"></i>
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
        Adding Member...
      </button>
    );
  }

  const confirmReg = (
    <div className={`bg-white flex flex-col p-2 mb-5  rounded-xl w-12/12 m-4`}>
      <div className="font-bold text-xl m-2 ">
        <span>Review Submission :</span>
      </div>
      {/* <button onClick={success}> click me</button> */}
      {contextHolder}

      <div className="flex flex-row justify-between mb-2 w-full flex-wrap">
        <div className="  flex flex-col justify-between flex-grow">
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Name:</label>
            <span
              className={` flex items-center w-7/12 bg-slate-200 p1 border-r-8  border-green-500 font-bold pl-1 focus:outline-none`}>
              {NewFormData.full_name}
            </span>
          </div>

          {/* <div className=" flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Last Name:</label>
            <span
              className={` flex items-center w-7/12 bg-slate-200 p1 border-r-8  border-green-500 font-bold pl-1 focus:outline-none`}
            >
              {NewFormData.last_name}
            </span>
          </div> */}

          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Gender:</label>
            <span
              className={` flex items-center w-7/12 bg-slate-200 p1 border-r-8  border-green-500 font-bold pl-1 focus:outline-none`}>
              {NewFormData.gender}
            </span>
          </div>
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label htmlFor="dob" className="text-white font-bold p-1">
              Date of Birth:
            </label>

            <span
              className={` flex items-center w-7/12 bg-slate-200 p1 border-r-8  border-green-500 font-bold pl-1 focus:outline-none`}>
              {NewFormData.dob &&
                JSON.stringify(NewFormData.dob)
                  .slice(1, 11)
                  .split("-")
                  .reverse()
                  .join("-")}
            </span>
          </div>
        </div>
        <div className="  flex flex-col justify-between flex-grow">
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Father's Name:</label>
            <span
              className={` flex items-center w-7/12 bg-slate-200 p1 border-r-8  border-green-500 font-bold pl-1 focus:outline-none`}>
              {NewFormData.fathers_name}
            </span>
          </div>
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Address:</label>
            <span
              className={` flex items-center w-7/12 bg-slate-200 p1 border-r-8  border-green-500 font-bold pl-1 focus:outline-none`}>
              {NewFormData.address}
            </span>
          </div>
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Phone No:</label>
            <span
              className={` flex items-center w-7/12 bg-slate-200 p1 border-r-8  border-green-500 font-bold pl-1 focus:outline-none`}>
              {NewFormData.phone_no}
            </span>
          </div>

          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Email:</label>
            <span
              className={` flex items-center w-7/12 bg-slate-200 p1 border-r-8  border-green-500 font-bold pl-1 focus:outline-none`}>
              {NewFormData.email}
            </span>
          </div>
        </div>
        <div className="  flex flex-col justify-between flex-grow ">
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Role:</label>
            <span
              className={` flex items-center w-7/12 bg-slate-200 p1 border-r-8  border-green-500 font-bold pl-1 focus:outline-none`}>
              {NewFormData.role}
            </span>
          </div>
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Branch Position:</label>
            <span
              className={` flex items-center w-7/12 bg-slate-200 p1 border-r-8  border-green-500 font-bold pl-1 focus:outline-none`}>
              {NewFormData.branch_position}
            </span>
          </div>

          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Assigned Under:</label>
            <span
              className={` flex items-center w-7/12 bg-slate-200 p1 border-r-8  border-green-500 font-bold pl-1 focus:outline-none`}>
              {NewFormData.assigned_under}
            </span>
          </div>

          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white flex-1 font-bold p-1">Password:</label>
            <span
              className={` flex items-center w-7/12 bg-slate-200 p1 border-r-8  border-green-500 font-bold pl-1 focus:outline-none`}>
              {NewFormData.password.replace(/./g, "*")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center m-1">
        <div className="text-yellow-600 font-bold">
          <span>
            *Name and Father's Name cannot be changed after Submission !
          </span>
        </div>
        <div className="flex">
          {RegButton}
          <button
            type="submit"
            className={`w-60 flex  flex-row justify-center bg-Primary   text-xl  text-white  mr-2 p-2  hover:border-Primary hover:border-opacity-80 rounded-xl ${"hover:opacity-80"}
        `}
            // disabled={!isFormValid()}
            onClick={() => {
              setshowReview(!showReview);
            }}>
            Change<i className="fa-solid fa-house"></i>
          </button>
        </div>
      </div>
    </div>
  );

  const RegForm = (
    <div className={`bg-white flex flex-col p-2 mb-5  rounded-xl w-12/12 m-4`}>
      <div className="font-bold text-xl m-2 ">
        <span>Member Registration :</span>
      </div>
      {/* <button onClick={success}> click me</button> */}
      {contextHolder}

      <div className="flex flex-row justify-between mb-2 w-full flex-wrap">
        <div className="  flex flex-col justify-between flex-grow">
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Name:</label>
            <input
              disabled
              className={`  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12  font-bold pl-1 focus:outline-none placeholder:text-black`}
              placeholder={props.full_name}
              name="first_name"
              type="text"
            />
          </div>

          {/* <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Last Name:</label>
            <input
              className={
                NewFormData.last_name.length === 0
                  ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-7/12 font-bold pl-1 focus:outline-none`
                  : NewFormData.last_name.length < 2
                  ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                  : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
              }
              onChange={handleLastName}
              value={NewFormData.last_name}
              name="last_name"
              type="text"
            />
          </div> */}

          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Gender:</label>
            <div
              className={
                !NewFormData.gender
                  ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-7/12 font-bold pl-1 focus:outline-none`
                  : NewFormData.gender.length < 2
                  ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                  : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
              }>
              <label htmlFor="Male" className="text-black p-1 ">
                <input
                  id="Male"
                  type="radio"
                  name="gender"
                  value="male"
                  checked={NewFormData.gender === "male"}
                  onChange={handleGender}
                />
                <span className="ml-2 font-bold">Male</span>
              </label>
              <label htmlFor="female" className="text-black p-1">
                <input
                  id="female"
                  type="radio"
                  name="gender"
                  value="female"
                  checked={NewFormData.gender === "female"}
                  onChange={handleGender}
                />
                <span className="ml-2 font-bold">Female</span>
              </label>
              <label htmlFor="other" className="text-black p-1">
                <input
                  id="other"
                  type="radio"
                  name="gender"
                  value="other"
                  checked={NewFormData.gender === "other"}
                  onChange={handleGender}
                />
                <span className="ml-2 font-bold">Other</span>
              </label>
            </div>
          </div>
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label htmlFor="dob" className="text-white font-bold p-1">
              Date of Birth:
            </label>

            <DatePicker
              placeholder={NewFormData.dob}
              format={"DD-MM-YYYY"}
              value={NewFormData.dob}
              onChange={handleDOB}
              className={
                !NewFormData.dob
                  ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-7/12 font-bold pl-1 focus:outline-none`
                  : NewFormData.dob.length < 2
                  ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                  : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
              }
            />
          </div>
        </div>
        <div className="  flex flex-col justify-between flex-grow">
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Father's Name:</label>
            <input
              className={
                NewFormData.fathers_name.length === 0
                  ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-7/12 font-bold pl-1 focus:outline-none`
                  : NewFormData.fathers_name.length < 2
                  ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                  : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
              }
              onChange={handleFathersName}
              value={NewFormData.fathers_name}
              name="fathers_name"
              type="text"
            />
          </div>
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Address:</label>
            <input
              className={
                NewFormData.address.length === 0
                  ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-7/12 font-bold pl-1 focus:outline-none`
                  : NewFormData.address.length < 2
                  ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                  : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
              }
              onChange={handleAddress}
              value={NewFormData.address}
              name="address"
              type="text"
            />
          </div>
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Phone No:</label>
            <input
              className={
                NewFormData.phone_no.length === 0
                  ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-7/12 font-bold pl-1 focus:outline-none `
                  : NewFormData.phone_no.length < 10
                  ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                  : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
              }
              onChange={handlePhoneNo}
              value={NewFormData.phone_no}
              name="phone_no"
              type="number"
            />
          </div>

          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Email:</label>
            <input
              className={
                NewFormData.email.length === 0
                  ? `rounded-r-md bg-slate-200 p1 border-r-8  border-yellow-500  w-7/12 font-bold pl-1 focus:outline-none`
                  : emailError
                  ? `rounded-r-md  bg-slate-200 box-border border-r-8 border-red-600 p1 w-7/12 font-bold pl-1 focus:outline-none`
                  : `rounded-r-md  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12 font-bold pl-1 focus:outline-none`
              }
              onChange={handleEmail}
              value={NewFormData.email}
              name="email"
              type="text"
            />
          </div>
        </div>
        <div className="  flex flex-col justify-between flex-grow ">
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Role:</label>
            <select
              className={
                NewFormData.role.length === 0
                  ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-7/12 font-bold pl-1 focus:outline-none`
                  : NewFormData.role.length < 2
                  ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                  : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
              }
              onChange={handleRole}
              value={NewFormData.role}
              name="role">
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="executive">Executive</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Branch Position:</label>
            <input
              className={
                NewFormData.branch_position.length === 0
                  ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-7/12 font-bold pl-1 focus:outline-none`
                  : NewFormData.branch_position.length < 2
                  ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                  : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
              }
              onChange={handleBranchPosition}
              value={NewFormData.branch_position}
              name="branch_position"
              type="text"
            />
          </div>

          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white font-bold p-1">Assigned Under:</label>
            <select
              className={
                NewFormData.assigned_under.length === 0
                  ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-7/12 font-bold pl-1 focus:outline-none `
                  : NewFormData.assigned_under.length < 2
                  ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
                  : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-7/12  font-bold pl-1 focus:outline-none`
              }
              onChange={handleAssignedUnder}
              value={NewFormData.assigned_under}
              name="assigned_under">
              <option value="">{NewFormData.assigned_under}</option>
              {Members.map(
                (item) =>
                  (item.role === "admin" || item.role === "manager") && (
                    <option value={item.full_name}>{item.full_name}</option>
                  )
              )}

              {/* Add more options as needed */}
            </select>
          </div>

          <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
            <label className="text-white flex-1 font-bold p-1">Password:</label>
            <input
              type={showPass ? "text" : "password"}
              className={
                NewFormData.password.length === 0
                  ? ` bg-slate-200 p1 border-r-8  border-yellow-500  w-6/12 font-bold pl-1 focus:outline-none`
                  : passwordError
                  ? `  bg-slate-200 box-border border-r-8 border-red-600 p1 w-6/12  font-bold pl-1 focus:outline-none`
                  : `  bg-slate-200  box-border  border-r-8 border-green-600 p1 w-6/12  font-bold pl-1 focus:outline-none`
              }
              onChange={handlePassword}
              value={NewFormData.password}
              name="password"
            />
            <button
              onClick={() => {
                setShowPass(!showPass);
              }}
              className="relative  bg-slate-200 rounded-r-md flex justify-center items-center focus:outline-none w-1/12">
              {showPass ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center">
        <div>
          <button
            type="submit"
            className={`w-60 flex  flex-row justify-center bg-Primary   text-xl  text-white  mr-2 p-2  hover:border-Primary hover:border-opacity-80 rounded-xl ${
              !isFormValid()
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-80"
            }
    `}
            // disabled={!isFormValid()}
            onClick={() => {
              setshowReview(!showReview);
            }}
            disabled={!isFormValid()}>
            Update Member<i className="fa-solid fa-house"></i>
          </button>
        </div>
      </div>
    </div>
  );
  const member_options = Members.map((item) => ({
    value: item.full_name,
    label: item.full_name,
  }));
  return <>{showReview ? confirmReg : RegForm}</>;
};
export default MemberUpdationForm;
