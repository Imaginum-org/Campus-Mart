import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import "../../../styles/deletestyle.css";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { deleteAccount } from "../../../features/user/api/userApi.js";

function AlertDialogDemo() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleDeleteAccount = async () => {
    if (loading) return; // prevent double click

    try {
      setLoading(true);

      const response = await deleteAccount();

      if (response.data.success) {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("cachedUserDetails");

        toast.success("Your account has been permanently deleted.");

        navigate("/signup");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <button className="text-[#E40000] text-[13px] lg:text-[17px] font-normal font-['Poppins'] xl:text-[15px] bg-[#FFDDDD] rounded-lg px-[2.5vw] py-[0.9vh] lg:px-[0.8vw] lg:py-[0.8vh] xl:px-[1vw] xl:py-[1vh] transition-all duration-300 cursor-pointer hover:bg-[#f9c7c7]">
            Delete Account
          </button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="AlertDialogOverlay fixed inset-0 z-[999] bg-black/60 backdrop-blur-[2px] data-[state=open]:animate-overlayShow" />

          <AlertDialog.Content className="AlertDialogContent fixed left-[50%] top-[50%] z-[1000] w-[90vw] md:w-[450px] translate-x-[-50%] translate-y-[-50%]">
            <AlertDialog.Title className="AlertDialogTitle">
              Are you absolutely sure?
            </AlertDialog.Title>
            <AlertDialog.Description
              style={{
                marginTop: 10,
              }}
              className="AlertDialogDescription"
            >
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialog.Description>
            <div
              style={{
                display: "flex",
                gap: 15,
                justifyContent: "flex-end",
                marginTop: 25,
              }}
            >
              <AlertDialog.Cancel asChild>
                <button
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                  className="Button mauve"
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="Button red"
                >
                  {loading ? "Deleting..." : "Yes, delete account"}
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}

export default AlertDialogDemo;
