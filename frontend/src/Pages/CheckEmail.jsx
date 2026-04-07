import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosSunny, IoMdMoon } from "react-icons/io";
import { toast } from "react-hot-toast";
import Image4 from "../assets/upper_circle_1.png";
import Image5 from "../assets/rectangle_1.png";
import Image6 from "../assets/rectangle_2.png";
import Image7 from "../assets/Homepage.png";
import Image9 from "../assets/circle_up.png";
import ImageShade from "../assets/login_shade.png";
import checkemailicon from "../assets/checkemailicon.png";
import { ArrowLeft, OctagonAlert } from 'lucide-react';

function CheckEmail() {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <div className="flex overflow-hidden select-none relative">
            {/* Top left image */}
            <div className="absolute -top-36 -left-52 z-10 opacity-70 dark:opacity-30 transition-opacity duration-300">
                <img src={ImageShade} className="w-[35vw] h-[52vh]" alt="shade" />
            </div>

            {/* LEFT SECTION */}
            <div className="relative h-screen w-[100%] lg:w-[38%] xl:w-[42%] bg-white shadow dark:bg-[#131313] transition-colors duration-300">

                {/* right side main content  */}
                <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white dark:bg-[#131313] sm:px-6 lg:px-8 transition-colors duration-300">
                    <div className="w-full max-w-sm space-y-8 z-20">

                        {/* Header Section */}
                        <div className="flex flex-col items-center text-center">
                            <div className="flex items-center justify-center w-16 h-16 mb-6 bg-blue-700/10 dark:bg-blue-500/20 rounded-full transition-colors duration-300">
                                <img src={checkemailicon} alt="Check Email Icon" className="w-8 h-7" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 sm:text-2xl lg:text-2xl font-['Inter'] transition-colors duration-300">
                                Check Your Email
                            </h2>
                            <p className="mt-4 lg:text-sm xl:text-sm text-gray-700 dark:text-gray-300 sm:text-base font-['Inter'] transition-colors duration-300">
                                We’ve sent a verification link to your email address.<br className="hidden sm:block" />
                                Please click the link to confirm your account.
                            </p>
                            <div className="px-4 py-2 mt-6 bg-slate-100 dark:bg-[#1e1e1e] border border-slate-300/30 dark:border-zinc-800 rounded-xl transition-colors duration-300">
                                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-['Inter'] transition-colors duration-300">
                                    student@university.edu
                                </span>
                            </div>
                        </div>

                        {/* Action Section */}
                        <div className="space-y-5">
                            <button className="w-full py-3 text-sm font-bold text-white transition-colors bg-indigo-600 rounded-xl hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 sm:text-sm lg:text-sm font-['Inter'] shadow-sm">
                                Reload / I’ve Verified
                            </button>

                            <div className="flex items-center justify-center gap-1 text-[0.80rem] font-['Inter']">
                                <span className="text-gray-700 dark:text-gray-400 transition-colors duration-300">Didn’t receive the email?</span>
                                <button className="font-extrabold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                    Resend Email
                                </button>
                            </div>

                            <div className="p-4 bg-slate-100 dark:bg-[#1e1e1e] rounded-3xl outline outline-1 outline-offset-[-1px] outline-slate-300/10 dark:outline-zinc-800 inline-flex justify-start items-start gap-3 transition-colors duration-300">
                                <div className="pt-1">
                                    <OctagonAlert size={15} className="text-red-500 dark:text-red-400" />
                                </div>
                                <div>
                                    <div className="text-gray-700 dark:text-gray-300 text-xs font-normal font-['Inter'] leading-5 transition-colors duration-300">
                                        Check your spam folder if you don&apos;t see the message within a few minutes. Make sure your university firewall isn&apos;t blocking our domain.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="absolute bottom-6 w-full left-0 flex items-center justify-center pt-2">
                            <Link to={"/login"} className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-gray-200 font-['Inter']">
                                <ArrowLeft size={15} /> Back to registration
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="h-screen w-[0%] lg:w-[62%] relative overflow-hidden bg-gradient-to-l from-[#364EF2] to-[#534ff2]">
                <button
                    onClick={() => toggleDarkMode()}
                    aria-label="Toggle dark mode"
                    className="transition duration-500 ease-in-out absolute right-[8%] top-[34.4%] z-20"
                >
                    {darkMode ? (
                        <IoIosSunny className="text-[#FFD119] sm:size-4 md:size-5 lg:size-6 xl:size-5 transition-all duration-500 ease-in-out rotate-0 scale-100" />
                    ) : (
                        <IoMdMoon className="text-[#323232] sm:size-4 md:size-5 lg:size-6 xl:size-5 transition-all duration-500 ease-in-out rotate-0 scale-100" />
                    )}
                </button>

                <div className="absolute font-figtree top-[12%] left-[27%] text-[#ffffd5] text-[40px] font-black tracking-tight leading-tight">
                    Find What You Need, <br />
                    Sell What You Don't!
                </div>

                <img src={Image6} className="absolute top-[-4%] left-[-10%] w-[55vw]" alt="graphic" />
                <img src={Image5} className="absolute top-[18%] left-[-13%] w-[55vw]" alt="graphic" />
                <img src={Image4} className="absolute top-0 right-0 w-[10vw]" alt="graphic" />
                <img src={Image7} className="absolute bottom-0 right-0 w-[46vw]" alt="graphic" />
            </div>

        </div>
    );
}

export default CheckEmail;