import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "../../../services/axiosInstance";

import ImageShade from "../../../assets/login_shade.png";
import checkemailicon from "../../../assets/checkemailicon.png";
import { ArrowLeft, OctagonAlert } from "lucide-react";
import AuthPageRightPart from "../components/AuthPageRightPart";

function CheckEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  // Grab the email passed from the signup page.
  // If someone visits this page directly without signing up, it falls back to empty.
  const email = location.state?.email || "";

  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error("No email found. Please try registering again.");
      return navigate("/signup");
    }

    setIsResending(true);
    try {
      const response = await axios.post("/api/auth/resend-verification", {
        email,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Verification email resent!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend verification email.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyStatus = async () => {
    if (!email) {
      toast.error("No email found. Please try registering again.");
      return navigate("/signup");
    }

    setIsChecking(true);
    try {
      const response = await axios.get("/api/auth/check-verification", {
        params: { email },
      });

      if (response.data.success) {
        if (response.data.verified) {
          toast.success("Email verified! Redirecting to login...");
          navigate("/login");
        } else {
          toast("Email is not verified yet.");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to verify email status.",
      );
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex overflow-hidden select-none relative">
      <div className="absolute -top-36 -left-52 z-10 opacity-70 dark:opacity-30 transition-opacity duration-300">
        <img src={ImageShade} className="w-[35vw] h-[52vh]" alt="shade" />
      </div>

      {/* LEFT SECTION */}
      <div className="relative h-screen w-[100%] lg:w-[38%] xl:w-[42%] bg-white shadow dark:bg-[#131313] transition-colors duration-300">
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white dark:bg-[#131313] sm:px-6 lg:px-8 transition-colors duration-300">
          <div className="w-full max-w-sm space-y-8 z-20">
            {/* Header Section */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-6 bg-blue-700/10 dark:bg-blue-500/20 rounded-full transition-colors duration-300">
                <img
                  src={checkemailicon}
                  alt="Check Email Icon"
                  className="w-8 h-7"
                />
              </div>
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 sm:text-2xl lg:text-2xl font-['Inter'] transition-colors duration-300">
                Check Your Email
              </h2>
              <p className="mt-4 lg:text-sm xl:text-sm text-gray-700 dark:text-gray-300 sm:text-base font-['Inter'] transition-colors duration-300">
                We’ve sent a verification link to your email address.
                <br className="hidden sm:block" />
                Please click the link to confirm your account.
              </p>
              <div className="px-4 py-2 mt-6 bg-slate-100 dark:bg-[#1e1e1e] border border-slate-300/30 dark:border-zinc-800 rounded-xl transition-colors duration-300">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-['Inter'] transition-colors duration-300">
                  {/* Dynamically display the actual email */}
                  {email || "Unknown Email"}
                </span>
              </div>
            </div>

            {/* Action Section */}
            <div className="space-y-5">
              <button
                onClick={handleVerifyStatus}
                disabled={isChecking}
                className="w-full py-3 text-sm font-bold text-white transition-colors bg-indigo-600 rounded-xl hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm disabled:opacity-50"
              >
                {isChecking ? "Checking..." : "Reload / I’ve Verified"}
              </button>

              <div className="flex items-center justify-center gap-1 text-[0.80rem] font-['Inter']">
                <span className="text-gray-700 dark:text-gray-400 transition-colors duration-300">
                  Didn’t receive the email?
                </span>

                {/* Dynamic Resend Button */}
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="font-extrabold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend Email"}
                </button>
              </div>

              <div className="p-4 bg-slate-100 dark:bg-[#1e1e1e] rounded-3xl outline outline-1 outline-offset-[-1px] outline-slate-300/10 dark:outline-zinc-800 inline-flex justify-start items-start gap-3 transition-colors duration-300">
                <div className="pt-1">
                  <OctagonAlert
                    size={15}
                    className="text-red-500 dark:text-red-400"
                  />
                </div>
                <div>
                  <div className="text-gray-700 dark:text-gray-300 text-xs font-normal font-['Inter'] leading-5 transition-colors duration-300">
                    Check your spam folder if you don&apos;t see the message
                    within a few minutes. Make sure your university firewall
                    isn&apos;t blocking our domain.
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="absolute bottom-6 w-full left-0 flex items-center justify-center pt-2">
              <Link
                to={"/signup"}
                className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-gray-200 font-['Inter']"
              >
                <ArrowLeft size={15} /> Back to registration
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <AuthPageRightPart />
    </div>
  );
}

export default CheckEmail;
