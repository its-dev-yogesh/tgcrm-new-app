import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
export const TGCRMContext = createContext();

export const Context = ({ children }) => {
  //////////////user States/////////
  const [userToken, setuserToken] = useState(null);
  const [AuthUser, setAuthUser] = useState({});
  const [LoginMessage, setLoginMessage] = useState(
    "Login with Email and Password"
  );
  const [islogin, setislogin] = useState(false);
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [memberData, setMemberData] = useState([]);
  const [CourseData, setCourseData] = useState([]);
  const [StatusData, setStatusData] = useState([]);
  const [SourcesData, setSourcesData] = useState([]);
  const [LeadsData, setLeadsData] = useState([]);
  const [userLeads, setuserLeads] = useState([]);
  const [PerformanceData, setPerformanceData] = useState([]);
  let GLOBAL_API_URI = "https://tgcrm-new-api.vercel.app//";
  useEffect(() => {
    getMember();
    getCourse();
    getStatus();
    getSource();
    getLeads();
    getPerformance();
  }, []);
  //////Fetch Member///
  const getMember = async () => {
    try {
      const response = await axios.get("https://tgcrm-new-api.vercel.app//member");

      setMemberData(response.data);
    } catch (error) {}
  };
  ///////////////Login///////////////
  const login = async ({ email, password }) => {
    try {
      setislogin(true);
      const response = await fetch("https://tgcrm-new-api.vercel.app//login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { token, memberData } = await response.json();

      // const data = await response.json();

      if (!token) {
        setuserToken(null);
        setislogin(false);
        setLoginMessage("Email Or Password is Incorrect");
        window.localStorage.removeItem("token_id");
        setAuthUser({});
      } else {
        // Handle the response token

        window.localStorage.setItem("token_id", token);
        setisAuthenticated(true);
        setAuthUser(memberData);
        setuserToken(token);
        setislogin(false);
        setLoginMessage("Login Successfull");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  ////////////Logout////////////////////
  const logout = () => {
    window.localStorage.removeItem("token_id");
  };

  //////Fetch Member///
  const getCourse = async () => {
    try {
      const response = await axios.get("https://tgcrm-new-api.vercel.app//course");

      setCourseData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  //////Fetch Status///
  const getStatus = async () => {
    try {
      const response = await axios.get("https://tgcrm-new-api.vercel.app//status");

      setStatusData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //////Fetch Source///
  const getSource = async () => {
    try {
      const response = await axios.get("https://tgcrm-new-api.vercel.app//source");

      setSourcesData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //////Fetch Source///
  const getLeads = async () => {
    try {
      const response = await axios.get("https://tgcrm-new-api.vercel.app//leads");
      console.log(
        "🙏 ~ file: Context.js:125 ~ getLeads ~ response:",
        response.data
      );

      setLeadsData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const getLeadsFromDB = async (name) => {
    try {
      const newdata = { assigned_to: name };
      const response = await axios.post(
        "https://tgcrm-new-api.vercel.app//filter-leads",
        newdata
      );
      setuserLeads(response.data);
      console.log(
        "🙏 ~ file: Context.js:139 ~ getLeadsFromDB ~ leads",
        response.data
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
  //////Fetch Status///
  const getPerformance = async () => {
    try {
      const response = await axios.get("https://tgcrm-new-api.vercel.app//performance");

      setPerformanceData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <TGCRMContext.Provider
      value={{
        login,
        logout,
        islogin,
        LoginMessage,
        isAuthenticated,
        AuthUser,
        setislogin,
        userToken,
        getMember,
        memberData,
        getCourse,
        CourseData,
        getStatus,
        StatusData,
        getSource,
        SourcesData,
        getLeads,
        LeadsData,
        getPerformance,
        PerformanceData,
        GLOBAL_API_URI,
        getLeadsFromDB,
        userLeads,
      }}>
      {children}
    </TGCRMContext.Provider>
  );
};

export default Context;
