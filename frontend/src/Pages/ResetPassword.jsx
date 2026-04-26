import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Image9 from "../assets/circle_up.png";
import ImageShade from "../assets/login_shade.png";
import AuthPageRightPart from "../Components/AuthPageRightPart";
import { baseURL } from "../Common/SummaryApi";
import SummaryApi from "../Common/SummaryApi";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    const verifyTokenOnLoad = async () => {
      try {

        const response = await axios({
          method: "get", 
          url: `${baseURL}${SummaryApi.reset_password.url}${token}`,
        })
        if (response.data.success) {
          setIsTokenValid(true);
        }
      } catch (error) {
        setIsTokenValid(false);
        toast.error(error.response?.data?.message || "Invalid or expired link");
      } finally {
        setIsValidating(false);
      }
    };

    if (token) {
      verifyTokenOnLoad();
    }
  }, [token]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
 
      const response = await axios({
        method: SummaryApi.reset_password.method,
        url: `${baseURL}${SummaryApi.reset_password.url}${token}`,
        data: {
          password: password
        }
      });

      if (response.data.success) {
        toast.success("Password reset successfully!");
        setIsSuccess(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex overflow-hidden select-none relative">
      <div className="absolute -top-36 -left-52 z-10">
        <img src={ImageShade} className="w-[35vw] h-[52vh]" alt="shade" />
      </div>

      <div className="relative h-screen w-[100%] lg:w-[38%] xl:w-[42%] bg-white shadow dark:bg-[#131313] flex flex-col items-center">

        <Link to={"/"} className="flex items-center justify-center mt-[6vh] xl:mt-[8vh]">
          <svg className="mb-[0.4vh]" width="20" height="20" viewBox="0 0 27 26" fill="none">
            <path d="M18.05 8.79119C18.05 11.3414 15.5629 13.4088 13.0126 13.4088C10.4624 13.4088 7.9752 11.3414 7.9752 8.79119C7.9752 6.24094 5.42505 3.33398 7.9753 3.33398C10.5256 3.33398 18.05 6.24094 18.05 8.79119Z" stroke="#4D4EF2" strokeWidth="1.67914" />
            <path d="M19.1842 9.63082C19.1842 12.1811 16.6971 14.2485 14.1468 14.2485C11.5965 14.2485 9.10938 12.1811 9.10938 9.63082C9.10938 7.08056 15.0807 1.23511 17.6309 1.23511C20.1812 1.23511 19.1842 7.08056 19.1842 9.63082Z" stroke="#534FF2" strokeWidth="1.67914" />
            <path d="M4.12511 10.2522C4.41527 9.14425 5.41637 8.37158 6.56164 8.37158H19.7557C20.8938 8.37158 21.8905 9.13479 22.1872 10.2335L25.5888 22.8271C26.0212 24.4279 24.8154 26.0026 23.1572 26.0026H3.26333C1.6131 26.0026 0.408693 24.4421 0.826795 22.8457L4.12511 10.2522Z" fill="#394FF1" />
          </svg>
          <span className="text-[#012436] dark:text-[#FFFFFF] text-[18px] lg:text-[1.5rem] xl:text-[1.45rem] font-poppins font-semibold ml-[0.3vw]">
            Campus Mart
          </span>
        </Link>

        {/* UI LOGIC TREE */}
        {isValidating ? (
          /* 1. Loading State */
          <div className="mt-[20vh] text-center dark:text-white font-poppins animate-pulse">
            Verifying secure link...
          </div>
        ) : !isTokenValid ? (
          /* 2. Error State (Expired/Bad Link) */
          <div className="w-full flex flex-col items-center mt-[10vh]">
            <h1 className="font-robotoflex text-red-500 text-[22px] font-semibold lg:text-[1.8rem]">
              Link Expired
            </h1>
            <div className="text-center text-[#828F9B] dark:text-[#D6D6D6] text-[14px] lg:text-[15px] font-normal font-['Poppins'] mt-[2vh] mb-[4vh] w-[80%] lg:w-[65%]">
              This password reset link is invalid or has expired. For your security, links only last for 15 minutes.
            </div>
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-white bg-[#394FF1] rounded-md w-[80vw] h-[5vh] lg:w-[24.5vw] lg:h-[5.8vh] font-medium hover:bg-[#2b3ed6] transition-all"
            >
              Request a new link
            </button>
          </div>
        ) : !isSuccess ? (
          /* 3. Form State (Link is good, enter new password) */
          <div className="w-full flex flex-col items-center mt-[6vh]">
            <h1 className="font-robotoflex text-black text-[22px] dark:text-[#F1F1F1] font-semibold lg:text-[1.8rem] tracking-tight">
              Create a new password
            </h1>
            <div className="text-center text-[#828F9B] dark:text-[#D6D6D6] text-[14px] lg:text-[15px] font-normal font-['Poppins'] mt-[2vh] mb-[4vh] w-[80%] lg:w-[65%]">
              Your identity is verified. Set a new password that's secure and easy to remember.
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full mt-4">
              <div className="relative w-[80vw] lg:w-[24.5vw] mb-[2vh]">
                <label className="text-[#1e1e1e] dark:text-[#D6D6D6] text-[13.5px] lg:text-[15px] font-medium block mb-1">
                  New password
                </label>
                <input
                  className="w-full h-[5.2vh] lg:h-[5.8vh] rounded-md border border-[#DEDEDE] pl-3 pr-10 dark:text-white dark:bg-[#1a1d20] outline-none dark:border-[#848484] focus:border-[#394FF1] focus:ring-1 focus:ring-[#394FF1]"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
                <button
                  type="button"
                  className="absolute top-[60%] right-3 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="w-[80vw] lg:w-[24.5vw]">
                <label className="text-[#1e1e1e] dark:text-[#D6D6D6] text-[13.5px] lg:text-[15px] font-medium block mb-1">
                  Confirm new password
                </label>
                <input
                  className="w-full h-[5.2vh] lg:h-[5.8vh] rounded-md border border-[#DEDEDE] pl-3 dark:text-white dark:bg-[#1a1d20] outline-none dark:border-[#848484] focus:border-[#394FF1] focus:ring-1 focus:ring-[#394FF1]"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Type your new password again"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="text-white bg-[#394FF1] rounded-md w-[80vw] h-[5vh] lg:w-[24.5vw] lg:h-[5.8vh] mt-[4vh] font-medium hover:bg-[#2b3ed6] disabled:opacity-60 transition-all"
              >
                {isSubmitting ? "Updating..." : "Update password"}
              </button>
            </form>
          </div>
        ) : (
          /* 4. Success State */
          <div className="w-full flex flex-col items-center mt-[10vh]">
            <h1 className="font-robotoflex text-black text-[22px] dark:text-[#F1F1F1] font-semibold lg:text-[1.8rem] tracking-tight">
              Password updated
            </h1>
            <div className="text-center text-[#828F9B] dark:text-[#D6D6D6] text-[14px] lg:text-[15px] font-normal font-['Poppins'] mt-[2vh] mb-[4vh] w-[80%] lg:w-[65%]">
              Your password has been changed successfully. You can now sign in again with your new password.
            </div>

            <button
              onClick={() => navigate("/login")}
              className="text-white bg-[#394FF1] rounded-md w-[80vw] h-[5vh] lg:w-[24.5vw] lg:h-[5.8vh] font-medium hover:bg-[#2b3ed6] transition-all"
            >
              Back to sign in
            </button>
          </div>
        )}

        <div className="lg:hidden flex justify-center mt-auto mb-10">
          <img src={Image9} className="w-[89vw] h-[24vh] object-contain" alt="graphic" />
        </div>
      </div>

      <AuthPageRightPart />
    </div>
  );
}

export default ResetPassword;