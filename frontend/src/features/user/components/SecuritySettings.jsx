import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import EditButton from "./editbutton";

import { toast } from "react-hot-toast";
import { X } from "lucide-react";

import { forgotPassword } from "../../../features/auth/api/authApi.js";

export default function SecuritySettings() {
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleSendResetLink = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setMessage("Please enter your email to reset password.");
      setIsSuccess(false);
      toast.error("Please enter your email to reset password.");
      return;
    }

    try {
      setIsSendingReset(true);

      const response = await forgotPassword({ email: resetEmail });

      if (response.data.success) {
        setMessage("Password reset link sent successfully.");
        setIsSuccess(true);

        toast.success("Password reset link sent successfully.");

        setResetEmail("");
        setIsEditing(false);
      } else {
        setMessage(response.data.message || "Unable to send reset link.");
        setIsSuccess(false);

        toast.error(response.data.message || "Unable to send reset link.");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to send reset link.";

      setMessage(errorMessage);
      setIsSuccess(false);

      toast.error(errorMessage);
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A1D20] rounded-2xl shadow md:mr-[2.5vw] md:ml-[1.5vw] lg:mx-[4.5vw] mt-[3vh] mx-[3vw] pt-[4vh] pb-[2vh] relative font-poppins xl:mx-[3vw]">
      <div className="text-xl xl:text-lg text-[15px] font-semibold lg:text-xl ml-[2.6vw] lg:ml-[2.6vw] dark:text-[#D7D7D7] lg:mb-[2vh] mb-[2vh] xl:mb-[3vh]">
        Security
      </div>

      <div className="grid grid-cols-2 grid-rows-2 ml-[3.5vw] xl:ml-[3.4vw]">
        <div>
          <div className="dark:text-[#BBC2C9] text-[14px] lg:text-[18px] xl:text-[17px] font-medium">
            Password
          </div>
          <div className="text-[#64707d] text-[15px] lg:text-[18px] lg:font-medium mb-[2.8vh] lg:mb-[2.7vh]">
            ●●●●●●●●●●
          </div>
        </div>

        <div className="flex items-center justify-end mr-[3.5vw]">
          <div className="text-[#64707D] dark:text-[#D7D7D7] text-[11.5px] lg:text-[17px] lg:font-normal xl:text-[15px]">
            Updated 2 months ago
          </div>
        </div>

        <div>
          <div className="text-[#1e1e1e]  dark:text-[#BBC2C9] text-[12px] font-medium lg:text-[17px] lg:font-medium xl:text-[17px]">
            Two-Factor Authentication
          </div>
          <div className="text-[#64707D] text-[10px] lg:text-[17px] font-medium xl:text-[15px] dark:text-[#64707D]">
            Enhance your account security
          </div>
        </div>

        <div className="flex items-center justify-end mr-[3.5vw]">
          <div className="text-[#64707d] text-[11px] lg:text-[18px] font-normal xl:text-[15px]">
            Enabled
          </div>
        </div>
      </div>

      <Dialog.Root open={isEditing} onOpenChange={setIsEditing}>
        <Dialog.Trigger asChild>
          <div className="absolute top-4 right-2 md:top-4 md:right-4 xl:top-6 xl:right-5">
            <EditButton isEditing={isEditing} />
          </div>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-[2px] data-[state=open]:animate-overlayShow" />

          <Dialog.Content className="fixed left-[50%] top-[50%] z-[1000] w-[90vw] md:w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[20px] bg-white dark:bg-[#1A1D20] p-6 shadow-2xl focus:outline-none font-['Poppins'] data-[state=open]:animate-contentShow">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-[#2d3339] dark:text-white">
                Reset Password
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>

            <Dialog.Description className="text-sm text-gray-500 mb-4 hidden">
              Enter your old password and set a new one.
            </Dialog.Description>

            <form
              className="flex flex-col gap-4"
              onSubmit={handleSendResetLink}
            >
              <div>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-blue-500 dark:bg-[#2D3339] dark:border-gray-600 dark:text-white text-sm"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>

              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`text-sm font-medium px-4 py-2 rounded-md border mb-2 ${
                      message.includes("success")
                        ? "bg-green-100 text-green-800 border-green-400"
                        : "bg-red-100 text-red-800 border-red-400"
                    }`}
                  >
                    {isSuccess ? "✅" : "⚠️"} {message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 mt-4">
                <Dialog.Close asChild>
                  <button className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-[10px] font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="flex-1 py-3 bg-[#4d4ef2] text-white rounded-[10px] font-medium hover:bg-[#3b3be0] transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingReset ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
