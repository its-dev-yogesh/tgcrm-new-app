import React, { useContext, useEffect, useState } from "react";
import Logo from "../../../Assets/Images/Logo.png";
import { colors } from "../../../Theme/Theme";
import { TGCRMContext } from "../../../Context/Context";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line
import LoginModal from "../../Modals/LoginModal/LoginModal";
const LoginForm = () => {
  // eslint-disable-next-line

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // eslint-disable-next-line
  const [showModal, setShowModal] = useState(false);
  const { islogin, login, setislogin, userToken, LoginMessage, AuthUser } =
    useContext(TGCRMContext);
  const navigate = useNavigate();
  useEffect(() => {
    //////////login Function at refresh////
    const login_start = () => {
      const token = window.localStorage.getItem("token_id");

      if (token === null) {
        console.log("Token Not Found");
      } else {
        const decoded = jwt_decode(token);
        console.log(
          "Token from Local decoded ",
          decoded.email,
          "Password:",
          decoded.password,
          "data:",
          decoded
        );
        login({ email: decoded.email, password: decoded.password });
      }
    };

    login_start(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userToken === null) {
      console.log("login");
    } else {
      if (AuthUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user");
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);
  useEffect(() => {
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
    }, 2000);
  }, [islogin]);

  ////////////Form Submit//////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginCreds = {
      email,
      password,
    };
    login(loginCreds);
  };

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Invalid password");
    } else {
      setPasswordError("");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value.toLowerCase());
    validateEmail();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePassword();
  };

  const isFormValid = () => {
    return email && password && !emailError && !passwordError;
  };
  let LoginButton;
  if (islogin === false) {
    LoginButton = (
      <button
        type="submit"
        className={`w-full bg-Primary py-3 text-center text-white rounded-lg ${
          !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!isFormValid()}
      >
        Sign In <i className="fa-solid fa-house"></i>
      </button>
    );
  } else {
    LoginButton = (
      <button
        // disabled
        type="submit"
        // type="button"
        onClick={() => {
          setislogin(!islogin);
        }}
        className={`w-full bg-Primary py-3 text-center text-white rounded-lg opacity-50 cursor-not-allowed`}
      >
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-4 h-4 mr-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Signing In...
      </button>
    );
  }

  return (
    <div
      className="flex flex-col min-h-full lg:min-h-screen lg:py-40"
      style={{
        backgroundImage: `linear-gradient(115deg,${colors.primary} ,${colors.secondary} )`,
      }}
    >
      {/* {showModal && <LoginModal />} */}
      <div className="container lg:mx-auto  ">
        <div className="flex flex-col lg:flex-row w-full  lg:w-7/12 bg-white rounded-none mx-auto lg:shadow-lg overflow-hidden lg:rounded-xl">
          <div
            className="w-full lg:w-1/2 flex flex-col items-center justify-center p-3 lg:p-12 bg-no-repeat bg-contain bg-center bg-opacity-30"
            style={{
              backgroundColor: `${colors.secondary}`,
            }}
          >
            <img className="lg:w-1/2 w-8/12 " alt={""} src={Logo} />
          </div>
          <div className="md:w-12/12 lg:w-1/2 py-4 lg:py-16 px-5 ">
            <h2 className="text-3xl mb-4">Sign In</h2>
            <p className="text-sm">Enter Your TCRM Email & Password</p>
            <form action="#" onSubmit={handleSubmit}>
              <div className="mt-5">
                <input
                  name="email"
                  type="text"
                  placeholder="Email"
                  className={
                    email.length === 0
                      ? `border-b-2 border-l-2 focus:outline-none border-Secondary py-1 px-2 w-full rounded-lg`
                      : emailError
                      ? `border-b-2 border-l-2  focus:outline-none border-red-400 py-1  px-2 w-full rounded-lg`
                      : `border-b-2 border-l-2 focus:outline-none border-green-400 py-1 px-2 w-full rounded-lg`
                  }
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="flex mt-5">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className={
                    password.length === 0
                      ? "border-b-2 border-l-2 focus:outline-none border-Secondary py-1 px-2 w-full rounded-lg"
                      : passwordError
                      ? "border-b-2 border-l-2 focus:outline-none border-red-400 py-1  px-2 w-full rounded-lg"
                      : "border-b-2 border-l-2 focus:outline-none border-green-400 py-1 px-2 w-full rounded-lg"
                  }
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="flex items-center mt-2 justify-between">
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4"
                    onChange={() => setShowPass(!showPass)}
                  />
                  <span className="text-sm text-gray-600">Show password</span>
                </label>

                <label className="flex items-center mt-2">
                  <button className="text-sm text-blue-600">
                    forgot password!
                  </button>
                </label>
              </div>

              <div className="mt-5 flex justify-center">{LoginButton}</div>
            </form>
          </div>
        </div>
      </div>{" "}
      <div className="flex flex-full bg-white-500 text-white text-sm justify-center my-2">
        copyright ©️ 2023 -Yan Innovations
      </div>
      <div className="flex flex-full bg-white-500 text-white text-sm justify-center my-2">
        {!userToken ? (
          LoginMessage
        ) : (
          <>Logged in using this token {JSON.stringify(userToken)} </>
        )}
      </div>
      {/* <div>
        <button className="bg-blue-500" onClick={logout}>
          logout
        </button>
      </div> */}
    </div>
  );
};

export default LoginForm;
