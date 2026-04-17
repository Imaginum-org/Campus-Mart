import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import SummaryApi, { baseURL } from "../Common/SummaryApi";
import Image9 from "../assets/circle_up.png";
import ImageShade from "../assets/login_shade.png";
import SignInwithGoogle from "./signinWithGoogle";
import AuthPageRightPart from "../Components/AuthPageRightPart";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("oauth") === "success") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    }
  }, [location.search, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios({
        method: SummaryApi.login.method,
        url: `${baseURL}${SummaryApi.login.url}`,
        data: {
          email: email,
          password: password,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Logged in successfully!");
        localStorage.setItem("isAuthenticated", "true"); 
        navigate("/"); 
      }
    } catch (error) {
       if (error.response?.data?.requiresVerification) {
        toast.error("Please verify your email first. Redirecting...");
        
         setTimeout(() => {
          navigate("/checkEmail", { state: { email: email } });
        }, 1500);
        
        return; 
      }
      const errorMessage = error.response?.data?.message || "An error occurred connecting to the server.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex overflow-hidden select-none relative">
      {/* Top left image */}
      <div className="absolute -top-36 -left-52 z-10">
        <img src={ImageShade} className="w-[35vw] h-[52vh]" alt="shade" />
      </div>

      {/* LEFT SECTION */}
      <div className="relative h-screen w-[100%] lg:w-[38%] xl:w-[42%] bg-white shadow dark:bg-[#131313]">
        <Link
          to={"/"}
          className="flex items-center justify-center mt-[6vh] xl:mt-[8vh]"
        >
          {/* SVG Logo kept intact */}
          <svg className="mb-[0.4vh]" width="20" height="20" viewBox="0 0 27 26" fill="none">
            <path d="M18.05 8.79119C18.05 11.3414 15.5629 13.4088 13.0126 13.4088C10.4624 13.4088 7.9752 11.3414 7.9752 8.79119C7.9752 6.24094 5.42505 3.33398 7.9753 3.33398C10.5256 3.33398 18.05 6.24094 18.05 8.79119Z" stroke="#4D4EF2" strokeWidth="1.67914" />
            <path d="M19.1842 9.63082C19.1842 12.1811 16.6971 14.2485 14.1468 14.2485C11.5965 14.2485 9.10938 12.1811 9.10938 9.63082C9.10938 7.08056 15.0807 1.23511 17.6309 1.23511C20.1812 1.23511 19.1842 7.08056 19.1842 9.63082Z" stroke="#534FF2" strokeWidth="1.67914" />
            <path d="M4.12511 10.2522C4.41527 9.14425 5.41637 8.37158 6.56164 8.37158H19.7557C20.8938 8.37158 21.8905 9.13479 22.1872 10.2335L25.5888 22.8271C26.0212 24.4279 24.8154 26.0026 23.1572 26.0026H3.26333C1.6131 26.0026 0.408693 24.4421 0.826795 22.8457L4.12511 10.2522Z" fill="#394FF1" />
          </svg>
          <span className="text-[#012436] dark:text-[#FFFFFF] text-[18px] lg:text-[1.5rem] xl:text-[1.45rem] font-poppins font-semibold ml-[0.3vw]">
            Campus Mart
          </span>
        </Link>

        <div>
          <h1 className="flex items-center justify-center mt-[3vh] lg:mt-[4vh] xl:mt-[6vh]">
            <span className="font-robotoflex text-black text-[18px] dark:text-[#F1F1F1] font-semibold  lg:text-[1.65rem] mr-[6px] xl:text-[1.55em] tracking-tight">
              Welcome to
            </span>
            <span className="font-robotoflex font-semibold bg-gradient-to-l from-blue-600 to-indigo-600 bg-clip-text text-transparent lg:text-[1.65rem] text-[18px] xl:text-[1.55rem] tracking-tight">
              Campus Mart
            </span>
          </h1>

          <div className="flex items-center justify-center text-[#828F9B] dark:text-[#D6D6D6] text-[13px] lg:text-[1.025rem] font-normal font-['Poppins'] mb-[3vh] xl:text-[1vw] xl:mb-[2vh] xl:mt-[1vh]">
            Enter your details to access Campus Mart.
          </div>

          {/* FORM: Added onSubmit here */}
          <div className="w-3/4 mx-auto">
            <form
              className="flex flex-col items-center justify-center"
              onSubmit={handleLogin}
            >
              {/* EMAIL */}
              <div className="mt-[3vh]">
                <div className="text-[#1e1e1e] dark:text-[#D6D6D6] text-[13.5px] lg:text-[15px] font-normal font-['Poppins'] xl:mb-1">
                  Email
                </div>
                <input
                  className="w-[77vw] h-[5.2vh] rounded-md lg:w-[24.5vw] lg:h-[5.8vh] border border-[#DEDEDE] pl-[4vw] dark:text-white dark:bg-[#1a1d20] lg:pl-[1vw] outline-none dark:border-[#848484]"
                  type="email"
                  value={email}
                  placeholder="Enter your email address"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="relative mt-[2vh]">
                <div className="text-[#1e1e1e] dark:text-[#D6D6D6] text-[13.5px] lg:text-[15px] xl:mb-1">
                  Password
                </div>

                <input
                  className="w-[77vw] h-[5vh] lg:w-[24.5vw] lg:h-[5.8vh] rounded-md border border-[#bbc2c9] pl-[1.2vw] dark:text-white dark:bg-[#1a1d20] outline-none dark:border-[#848484]"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="absolute top-[38%] right-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

                <div className="flex justify-end items-center mt-[2vh]">
                  <div className="text-[#2d3339] dark:text-[#BBC2C9] text-[12px] lg:text-sm font-medium cursor-pointer">
                    <Link to={"/forgot-password"}>Forgot Password</Link>
                  </div>
                </div>
              </div>

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-white bg-[#1a1d20] rounded-md w-[80vw] h-[5vh] lg:w-[24.5vw] lg:h-[5.8vh] mt-[3vh] hover:bg-[#0b0c0d] disabled:opacity-60 transition-opacity"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>

              {/* SEPARATOR */}
              <div className="flex items-center gap-2 my-[2vh]">
                <div className="w-[8vw] border dark:border-[#D7D7D7]"></div>
                <span className="text-[#64707d] dark:text-[#D6D6D6] text-[13px] xl:text-[14px]">
                  or continue with
                </span>
                <div className="w-[8vw] border dark:border-[#D7D7D7]"></div>
              </div>

              <SignInwithGoogle />

              <div className="mt-[2vh] xl:mt-0">
                <span className="text-[#848484] text-[13px] font-poppins">
                  Don't have an account?{" "}
                </span>
                <Link to={"/signup"}>
                  <span className="text-[#292929] dark:text-neutral-300 text-[13px] xl:text-[14px] font-medium font-poppins">
                    Create account
                  </span>
                </Link>
              </div>

              {/* Footer */}
              <div className="absolute bottom-[2vh] left-0 w-full flex flex-col items-center justify-center">
                <div className="hidden lg:block w-[35vw] border dark:border-[#D7D7D7]"></div>
                <div className=" hidden lg:flex items-center justify-between w-[35vw] text-[#AAB9C5] text-sm mt-[0.5vh]">
                  <span>@2026 Copyright Reserved</span>
                  <span>Login issues ? Contact us.</span>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:hidden flex justify-center">
          <img src={Image9} className="w-[89vw] h-[24vh]" alt="graphic" />
        </div>
      </div>
      {/* RIGHT SECTION */}
      <AuthPageRightPart />

    </div>
  );
}
export default Login;