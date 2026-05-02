import { useState } from "react";
import Profile_left_part from "../components/Profile_left_part.jsx";
import { MdEmail } from "react-icons/md";
import emailjs from "@emailjs/browser";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import Loading from "../../../components/ui/ContactLoader.jsx";

const faqs = [
  {
    question: "How do I track my order?",
    answer:
      "You can track your order from the 'My Orders' section in your account. Each order will have a tracking link once it is shipped.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 7-10 days of delivery, as long as the item is unused and in its original packaging.",
  },
  {
    question: "How can I change my shipping address?",
    answer:
      "You can change your shipping address from the 'My Account' section, or update it before placing your order at checkout.",
  },
];

function ContactUs() {
  const [contactType, setContactType] = useState("");
  const [message, setMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [isContactTypeOpen, setIsContactTypeOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!contactType || !message.trim()) {
      toast("Please fill all fields");
      return;
    }

    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        {
          contact_type:
            contactType === "order"
              ? "Order issue"
              : contactType === "payment"
                ? "Payment issue"
                : contactType === "account"
                  ? "Account help"
                  : "Other",
          message: message,
        },
        import.meta.env.VITE_PUBLIC_KEY,
      )
      .then(() => {
        toast.success("Message sent successfully!");
        setContactType("");
        setMessage("");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to send message. Try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleFAQ = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 1500,
          maxToasts: 1,
        }}
      />
      {loading && <Loading />}

      <div className="w-screen h-screen overflow-hidden dark:bg-[#131313]">
        {/* <Header bagUrl={bag} darkUrl={bluebag} /> */}

        <div className="flex h-[calc(100vh-70px)]">
          <div className="hidden md:block md:w-[37%] lg:w-[28%] xl:w-[26%] pt-[3.5vh] pl-[2vw] pr-[1.75vw] pb-[2vh] bg-[#FBFBFB] dark:bg-[#131313] xl:pt-[2.5vh] xl:-mr-4 xl:pb-0">
            <Profile_left_part />
          </div>
          <div className="h-full md:w-[63%] lg:w-[72%] xl:w-[73.5%] overflow-y-auto no-scrollbar bg-[#FBFBFB] dark:bg-[#131313] xl:pl-8">
            <div className="lg:ml-[1.5vw] md:ml-[2vw] md:mr-[3.2vw]">
              <div className="mt-[5vh] mb-[4vh] max-sm:ml-[4vw]">
                <div className="flex flex-col items-start">
                  <div className="text-[#2A2A2A] dark:text-[#F1F1F1] text-[18px] lg:text-[24px] font-medium font-poppins flex items-center xl:text-[1.4vw]">
                    <MdEmail
                      size={21}
                      className="mr-[1.5vw] lg:mr-[0.3vw] xl:mr-[0.5vw] text-[#364EF2]"
                    />
                    <span>Contact Us</span>
                  </div>

                  <div className="ml-[1vw] md:ml-[0.3vw] justify-start text-[#4D7399] text-sm md:text-base font-inter xl:text-sm xl:mt-1">
                    We&apos;re here to help! Please fill out the form below to
                    get in touch with our support team.
                  </div>

                  <div className="flex justify-center">
                    <div>
                      <form
                        onSubmit={handleSubmit}
                        className="rounded-xl py-6 px-3 mb-2 xl:mt-3"
                      >
                        <div className="mb-5">
                          <label
                            htmlFor="contactType"
                            className="block text-sm font-medium text-gray-800 mb-2 dark:text-white font-nirmala"
                          >
                            Contact Type
                          </label>

                          <div className="relative w-[80vw] md:w-[50vw] lg:w-[25vw]">
                            {/* Trigger */}
                            <button
                              type="button"
                              onClick={() =>
                                setIsContactTypeOpen((prev) => !prev)
                              }
                              className={`h-11 w-full rounded-lg border text-sm pl-3 pr-4 flex items-center justify-between outline-none  
        bg-white dark:bg-[#1A1D20] dark:text-white dark:border-none border-gray-300
        transition-all duration-200 ${isContactTypeOpen ? "shadow-md" : ""}`}
                            >
                              <span
                                className={
                                  contactType
                                    ? "text-gray-800 dark:text-white"
                                    : "text-gray-400"
                                }
                              >
                                {contactType === ""
                                  ? "Select a contact type"
                                  : contactType === "order"
                                    ? "Order issue"
                                    : contactType === "payment"
                                      ? "Payment issue"
                                      : contactType === "account"
                                        ? "Account help"
                                        : "Other"}
                              </span>

                              {/* Chevron */}
                              <span className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className={`w-4 h-4 transition-transform duration-200 ease-out dark:text-white ${
                                    isContactTypeOpen
                                      ? "rotate-180"
                                      : "rotate-0"
                                  }`}
                                >
                                  <path
                                    d="M6 9l6 6 6-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            </button>

                            <div
                              className={`
        absolute left-0 mt-1 w-full rounded-lg border font-['Poppins'] dark:text-white border-gray-200
        bg-white dark:bg-[#1A1D20] dark:border-none shadow-lg z-30 overflow-hidden
        transform origin-top transition-all duration-200 ease-out
        ${
          isContactTypeOpen
            ? "scale-y-100 opacity-100"
            : "scale-y-95 opacity-0 pointer-events-none"
        }
      `}
                            >
                              {[
                                { value: "order", label: "Order issue" },
                                { value: "payment", label: "Payment issue" },
                                { value: "account", label: "Account help" },
                                { value: "other", label: "Other" },
                              ].map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    setContactType(opt.value);
                                    setIsContactTypeOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#252A30]
            ${
              contactType === opt.value ? "bg-gray-100 dark:bg-[#252A30]" : ""
            }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-800 mb-2 dark:text-white"
                          >
                            Message
                          </label>
                          <textarea
                            id="message"
                            rows="5"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-[80vw] md:w-[50vw] lg:w-[25vw] rounded-lg border border-gray-300 text-sm px-3 py-2 resize-none outline-none dark:bg-[#1A1D20] dark:text-white dark:border-none"
                            placeholder="Describe your issue or question..."
                          />
                        </div>

                        {/* Button */}
                        <button
                          disabled={loading}
                          type="submit"
                          className="disabled:opacity-60 inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#364EF2] text-white text-sm font-medium transition-all ease-in-out duration-150 hover:bg-[#2d44dd] xl:py-3 xl:px-14"
                        >
                          {loading ? "Sending..." : "Send"}
                        </button>
                      </form>

                      {/* FAQ section */}
                      <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white font-['Roboto']">
                          Frequently Asked Questions
                        </h2>

                        <div className="space-y-3">
                          {faqs.map((item, index) => {
                            const isOpen = activeIndex === index;
                            return (
                              <div
                                key={index}
                                className="border dark:bg-[#1A1D20] border-gray-200 dark:border-none rounded-lg bg-white w-full  lg:w-[60vw]"
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleFAQ(index)}
                                  className="w-full flex items-center justify-between text-left px-4 py-3"
                                >
                                  <span className="text-sm sm:text-base text-gray-800 dark:text-white font-normal font-['Roboto']">
                                    {item.question}
                                  </span>

                                  <span className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      className={`w-4 h-4 transition-transform duration-300 dark:text-white ease-out ${
                                        isOpen ? "rotate-180" : "rotate-0"
                                      }`}
                                    >
                                      <path
                                        d="M6 9l6 6 6-6"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </span>
                                </button>

                                <div
                                  className={`grid transition-all duration-300 ease-out ${
                                    isOpen
                                      ? "grid-rows-[1fr] opacity-100"
                                      : "grid-rows-[0fr] opacity-0"
                                  }`}
                                >
                                  <div className="overflow-hidden">
                                    <div className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-400 font-normal font-['Poppins']">
                                      {item.answer}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
