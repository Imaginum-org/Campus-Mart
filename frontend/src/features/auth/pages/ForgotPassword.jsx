import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "../../../services/axiosInstance";

import Image9 from "../../../assets/circle_up.png";
import ImageShade from "../../../assets/login_shade.png";
import AuthPageRightPart from "../components/AuthPageRightPart";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Reset link sent!");
        setIsSubmitted(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
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
      <div className="relative h-screen w-[100%] lg:w-[38%] xl:w-[42%] bg-white shadow dark:bg-[#131313] flex flex-col items-center">
        {/* LOGO AND BRANDING */}
        <Link
          to={"/"}
          className="flex items-center justify-center mt-[6vh] xl:mt-[8vh]"
        >
          <svg
            className="mb-[0.4vh]"
            width="20"
            height="20"
            viewBox="0 0 27 26"
            fill="none"
          >
            <path
              d="M18.05 8.79119C18.05 11.3414 15.5629 13.4088 13.0126 13.4088C10.4624 13.4088 7.9752 11.3414 7.9752 8.79119C7.9752 6.24094 5.42505 3.33398 7.9753 3.33398C10.5256 3.33398 18.05 6.24094 18.05 8.79119Z"
              stroke="#4D4EF2"
              strokeWidth="1.67914"
            />
            <path
              d="M19.1842 9.63082C19.1842 12.1811 16.6971 14.2485 14.1468 14.2485C11.5965 14.2485 9.10938 12.1811 9.10938 9.63082C9.10938 7.08056 15.0807 1.23511 17.6309 1.23511C20.1812 1.23511 19.1842 7.08056 19.1842 9.63082Z"
              stroke="#534FF2"
              strokeWidth="1.67914"
            />
            <path
              d="M4.12511 10.2522C4.41527 9.14425 5.41637 8.37158 6.56164 8.37158H19.7557C20.8938 8.37158 21.8905 9.13479 22.1872 10.2335L25.5888 22.8271C26.0212 24.4279 24.8154 26.0026 23.1572 26.0026H3.26333C1.6131 26.0026 0.408693 24.4421 0.826795 22.8457L4.12511 10.2522Z"
              fill="#394FF1"
            />
          </svg>
          <span className="text-[#012436] dark:text-[#FFFFFF] text-[18px] lg:text-[1.5rem] xl:text-[1.45rem] font-poppins font-semibold ml-[0.3vw]">
            Campus Mart
          </span>
        </Link>

        {/* CONDITIONAL UI: Show Form OR Success Message */}
        {!isSubmitted ? (
          <div className="w-full flex flex-col items-center">
            <h1 className="font-robotoflex text-black text-[22px] dark:text-[#F1F1F1] font-semibold lg:text-[1.8rem] mt-[6vh] tracking-tight">
              Reset your password
            </h1>

            <div className="text-center text-[#828F9B] dark:text-[#D6D6D6] text-[14px] lg:text-[15px] font-normal font-['Poppins'] mt-[2vh] mb-[4vh] w-[80%] lg:w-[65%] leading-relaxed">
              Enter the campus email linked to your account. We&apos;ll send a
              secure verification link to continue.
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center w-full"
            >
              <div className="flex flex-col items-start w-[80vw] lg:w-[24.5vw]">
                <label className="text-[#1e1e1e] dark:text-[#D6D6D6] text-[13.5px] lg:text-[15px] font-medium font-['Poppins'] mb-2">
                  Campus email
                </label>
                <input
                  className="w-full h-[5.2vh] lg:h-[5.8vh] rounded-md border border-[#DEDEDE] pl-4 dark:text-white dark:bg-[#1a1d20] outline-none dark:border-[#848484] transition-colors focus:border-[#394FF1] focus:ring-1 focus:ring-[#394FF1]"
                  type="email"
                  value={email}
                  placeholder="name@domain.edu"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="text-white bg-[#394FF1] rounded-md w-[80vw] h-[5vh] lg:w-[24.5vw] lg:h-[5.8vh] mt-[4vh] font-medium hover:bg-[#2b3ed6] disabled:opacity-60 transition-all"
              >
                {isSubmitting ? "Sending link..." : "Send verification link"}
              </button>
            </form>
          </div>
        ) : (
          /* SUCCESS STATE UI */
          <div className="w-full flex flex-col items-center mt-[10vh]">
            <h1 className="font-robotoflex text-black text-[22px] dark:text-[#F1F1F1] font-semibold lg:text-[1.8rem] tracking-tight">
              Check your inbox
            </h1>
            <div className="text-center text-[#828F9B] dark:text-[#D6D6D6] text-[14px] lg:text-[15px] font-normal font-['Poppins'] mt-[2vh] w-[80%] lg:w-[65%] leading-relaxed">
              We&apos;ve sent a password reset link to <strong>{email}</strong>.
              Please click the link to create a new password.
            </div>
          </div>
        )}

        {/* Back to Login Link */}
        <Link
          to="/login"
          className="mt-[3vh] text-[14px] text-[#394FF1] font-medium hover:underline"
        >
          &larr; Back to login
        </Link>

        {/* Footer */}
        <div className="absolute bottom-[2vh] left-0 w-full flex flex-col items-center justify-center">
          <div className="hidden lg:block w-[35vw] border dark:border-[#D7D7D7]"></div>
          <div className="hidden lg:flex items-center justify-between w-[35vw] text-[#AAB9C5] text-sm mt-[0.5vh]">
            <span>@2026 Copyright Reserved</span>
            <span>Login issues? Contact us.</span>
          </div>
        </div>

        <div className="lg:hidden flex justify-center mt-auto mb-10">
          <img
            src={Image9}
            className="w-[89vw] h-[24vh] object-contain"
            alt="graphic"
          />
        </div>
      </div>

      <AuthPageRightPart />
    </div>
  );
}

export default ForgotPassword;
