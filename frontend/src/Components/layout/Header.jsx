import { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosSunny, IoMdMoon } from "react-icons/io";
import { FiMessageSquare } from "react-icons/fi";
import AvatarComponent from "../common/AvatarComponent.jsx";
import { IoIosAddCircleOutline } from "react-icons/io";
import { LuUserRound } from "react-icons/lu";
import { BsBoxSeam } from "react-icons/bs";
import { IoIosHeartEmpty } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import { MdOutlineLogout } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBackOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/useUserContext.jsx";
import { logoutUser } from "../../features/auth/api/authApi.js";
import { useTheme } from "../../context/ThemeContext.jsx";

const Header = ({ color, textColor, bagUrl, isHome, darkUrl, isChat }) => {
  const { userDetails, isLoggedIn, loading, fetchUserProfile, clearUserData } =
    useUser();

  const [search, setSearch] = useState("");
  const [notification] = useState(1);
  const [showmenu, setShowmenu] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const { darkMode, toggleDarkMode } = useTheme();

  const menuRef = useRef(null);
  const navigate = useNavigate();

  const placeholderWords = [
    "Electronics",
    "Book",
    "Cycle",
    "Essential",
    "Mattress",
  ];

  // Close menu on outside click / scroll
  useEffect(() => {
    const handleOutsideInteraction = (event) => {
      if (
        showmenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowmenu(false);
      }
    };

    const handleScroll = () => {
      if (showmenu) {
        setShowmenu(false);
      }
    };

    if (showmenu) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleOutsideInteraction);
      window.addEventListener("scroll", handleScroll);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", handleOutsideInteraction);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showmenu]);

  // Placeholder animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholderWords.length);
        setFade(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // fetch only when needed
  useEffect(() => {
    if (isLoggedIn && !userDetails) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const handleSearchBar = (e) => setSearch(e.target.value);
  const handleMenu = () => setShowmenu((p) => !p);

  const goToLogin = () => navigate("/login");
  const goToSignup = () => navigate("/signup");

  // logout (using API layer)
  const handleLogoutClick = async () => {
    try {
      const response = await logoutUser();

      if (response.data.success) {
        clearUserData();
        setShowmenu(false);
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {showmenu && (
        <div
          className="fixed inset-0 z-40 bg-black/10 sm:bg-transparent"
          onClick={() => setShowmenu(false)}
        />
      )}
      {/* MOBILE NAV*/}
      <nav
        style={{ backgroundColor: color, color: textColor }}
        className="flex sm:hidden justify-between items-center px-5 py-4 dark:bg-[#131313] relative z-20"
      >
        <button onClick={() => navigate(-1)}>
          <IoChevronBackOutline size={20} />
        </button>

        <div className="flex items-center gap-1 font-semibold">
          <img src="/logo.png" className="size-4" alt="logo" />
          <Link to="/" className="text-lg">
            Campus Mart
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleDarkMode}>
            {darkMode ? <IoIosSunny /> : <IoMdMoon />}
          </button>

          <button onClick={handleMenu}>
            <AvatarComponent
              name={userDetails?.name}
              imageUrl={userDetails?.avatar}
              size="small"
              isLoading={loading}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {showmenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="sm:hidden fixed right-4 top-16 z-50 bg-white dark:bg-[#131313] rounded-xl shadow-lg w-[65vw]"
          >
            <div className="p-4">
              <p>{userDetails?.name || "Guest User"}</p>
              <p>{userDetails?.email || ""}</p>
            </div>

            {isLoggedIn ? (
              <>
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogoutClick}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={goToLogin}>Login</button>
                <button onClick={goToSignup}>Signup</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isLoggedIn ? (
        <nav
          style={{ backgroundColor: color, color: textColor }}
          className={`hidden sm:flex text-black items-center justify-between pt-6 pb-3 md:pb-3 sm:pl-10 md:pr-10 lg:pl-[4.6vw] lg:pr-[4.6vw] lg:pb-2 lg:pt-5 xl:pb-4 xl:pt-5 relative dark:bg-[#131313]`}
        >
          {showmenu && (
            <AnimatePresence>
              <motion.div
                ref={menuRef} // Added ref here
                key="menu-desktop"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="menus fixed right-5 top-[7vh] md:right-10 md:top-[7vh] lg:top-[5vh] lg:right-14 xl:right-20 xl:top-20 z-50 bg-white border border-[#BBC2C9] rounded-xl font-outfit text-[#1A1D20] w-[90vw] sm:w-[60vw] md:w-[35vw] lg:w-[26vw] xl:w-[18vw] shadow-lg"
              >
                <Link
                  to={"/"}
                  className="flex items-center gap-4 px-4 pt-4 pb-3 hover:bg-gray-100 transition-all duration-200 rounded-t-xl"
                >
                  <AvatarComponent
                    name={userDetails?.name}
                    imageUrl={userDetails?.avatar}
                    size="medium"
                    isLoading={loading}
                  />
                  <div>
                    <h1 className="text-black font-medium text-sm sm:text-base">
                      {userDetails.name || "User"}
                    </h1>
                    <h2 className="text-[#64707D] text-xs sm:text-[11px] font-medium">
                      {userDetails.email || ""}
                    </h2>
                  </div>
                </Link>

                <div className="border-y border-[#DEDEDE]">
                  {[
                    { to: "/profile", icon: <LuUserRound />, label: "Profile" },
                    { to: "/myorders", icon: <BsBoxSeam />, label: "Orders" },
                    { to: "/chat", icon: <FiMessageSquare />, label: "Chat" },
                    {
                      to: "/wishlist",
                      icon: <IoIosHeartEmpty />,
                      label: "Wishlist",
                    },
                    { to: "/contact", icon: <CiMail />, label: "Contact Us" },
                  ].map(({ to, icon, label }, index) => (
                    <Link
                      key={index}
                      to={to}
                      onClick={() => setShowmenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-all duration-200"
                    >
                      <span className="text-lg">{icon}</span>
                      <h1 className="text-sm sm:text-base">{label}</h1>
                    </Link>
                  ))}
                </div>

                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-3 px-4 py-3 text-[#F20000] hover:bg-red-100 transition-all duration-200 rounded-b-xl w-full text-left"
                >
                  <span className="text-lg">
                    <MdOutlineLogout />
                  </span>
                  <h1 className="text-sm sm:text-base">Logout</h1>
                </button>
              </motion.div>
            </AnimatePresence>
          )}

          <div className="hidden items-center font-semibold text-lg gap-[0.4vw] md:text-base sm:flex lg:text-[1.7vw] xl:text-[1.4vw] font-poppins md:gap-[0.8vw] xl:gap-[0.5vw] dark:text-white">
            {darkMode ? (
              <img
                src="/logo.png"
                className="size-3 lg:size-4 xl:size-5"
                alt="logo"
              />
            ) : (
              <img
                src="/logo.png"
                className="size-3 lg:size-4 xl:size-5"
                alt="logo"
              />
            )}
            {isChat ? (
              <a href="/" className=" dark:text-white text-white">
                Campus Mart
              </a>
            ) : (
              <Link
                to="/"
                className=" dark:text-white bg-gradient-to-l from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                Campus Mart
              </Link>
            )}
          </div>

          <div className="relative items-center bg-white dark:bg-[#1A1D20] rounded-full shadow-[0px_3px_14px_0px_rgba(0,0,0,0.07)] outline outline-2 outline-neutral-200 dark:outline-[#848484] dark:outline-1 hover:shadow-md transition ease-in-out duration-200 hidden sm:flex cursor-pointer xl:py-[0.5vh] lg:pr-3 lg:mr-[2vw] xl:mr-[7vw]">
            <input
              className="rounded-md px-3 outline-none w-[25vw] md:w-[27vw] lg:w-[26vw] xl:w-[27vw] placeholder-transparent text-black sm:py-[0.4vh]  md:py-[0.9vh] lg:py-[0.5vh] xl:py-[0.6vh] text-md font-poppins lg:text-base md:text-xs lg:px-6 relative z-10 bg-transparent"
              type="text"
              value={search}
              onChange={handleSearchBar}
            />
            {search === "" && (
              <span
                className={`absolute left-4 lg:left-6 flex items-center gap-1 md:text-sm xl:text-base lg:text-sm`}
              >
                <span className="text-gray-500 dark:text-[#64707D]">
                  Search for
                </span>
                <span
                  className={` text-[#364EF2] pointer-events-none transition-opacity duration-500 z-0 ${
                    fade ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {placeholderWords[placeholderIndex]}
                </span>
              </span>
            )}
            <CiSearch
              size={22}
              className="text-black size-4 lg:size-5 mr-2 cursor-pointer dark:text-[#64707D]"
            />
          </div>

          <div className="hidden items-center text-[1.9vw] sm:flex gap-8 md:gap-7 lg:gap-10 font-medium xl:gap-10">
            <div className="flex justify-center items-center text-[1.5vw] sm:gap-5 lg:gap-8 xl:gap-10">
              <Link
                className="flex items-center text-white bg-gradient-to-l from-blue-600 to-indigo-600 xl:px-5 xl:text-base xl:py-[1.1vh] rounded-full xl:gap-2 md:py-[0.9vh] lg:py-[0.7vh] md:px-3 md:gap-1 md:text-xs lg:text-sm outline outline-1 outline-[#C6BCBC]"
                to={"/upload"}
              >
                <IoIosAddCircleOutline className="xl:size-5 size-4" />
                <h1>Sell Now</h1>
              </Link>

              <button onClick={() => toggleDarkMode()}>
                {darkMode ? (
                  <IoIosSunny className="text-[#FFD119] sm:size-4 md:size-5 lg:size-6" />
                ) : (
                  <IoMdMoon className="text-[#323232] sm:size-4 md:size-5 lg:size-6" />
                )}
              </button>

              <button className="relative dark:text-white">
                <IoNotificationsOutline className="sm:size-4 text-[#323232] md:size-5 lg:size-6 dark:text-[#848484]" />
                {notification > 0 && (
                  <span className="absolute bg-[#FF0F0F] text-white flex items-center justify-center rounded-full sm:size-2 text-xs p-[0.8vw] top-[-0.6vh] lg:top-[-0.7vh] right-[-0.3vw] xl:p-[0.5vw]">
                    {notification}
                  </span>
                )}
              </button>

              <Link to={"/chat"} className="relative dark:text-white">
                <FiMessageSquare className="sm:size-4 text-[#323232] md:size-5 lg:size-6 dark:text-[#848484]" />
                {notification > 0 && (
                  <span className="absolute bg-[#09C712] text-white flex items-center justify-center rounded-full sm:size-2 text-xs p-[0.8vw] top-[-0.6vh] lg:top-[-0.7vh] right-[-0.3vw] xl:p-[0.5vw]">
                    {notification}
                  </span>
                )}
              </Link>
            </div>

            <button
              onClick={handleMenu}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <AvatarComponent
                name={userDetails?.name}
                imageUrl={userDetails?.avatar}
                size="medium"
                isLoading={loading}
              />
            </button>
          </div>
        </nav>
      ) : (
        <nav
          style={{ backgroundColor: color, color: textColor }}
          className={`hidden sm:flex text-black items-center justify-between pt-6 pb-3 md:pb-0 sm:pl-10 md:pr-10 lg:pl-[4.6vw] lg:pr-[4.6vw] lg:pb-2 lg:pt-5 xl:pb-4 xl:pt-5 dark:bg-[#131313] relative`}
        >
          {/* Logo Section */}
          <div className="hidden items-center font-semibold text-lg gap-[0.4vw] md:text-base sm:flex lg:text-lg xl:text-[1.4vw] font-poppins md:gap-[0.8vw] lg:gap-[0.8vw] xl:gap-[0.5vw] dark:text-white">
            {darkMode ? (
              <img
                src="/logo.png"
                className="size-3 lg:size-4 xl:size-5"
                alt="logo"
              />
            ) : (
              <img src="/logo.png" className="size-3 lg:size-5" alt="logo" />
            )}
            <Link
              to="/"
              className="bg-gradient-to-l from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:text-white"
            >
              Campus Mart
            </Link>
          </div>

          <div className="relative items-center bg-white dark:bg-[#1A1D20] rounded-full shadow-[0px_3px_14px_0px_rgba(0,0,0,0.07)] outline outline-2 outline-neutral-200 dark:outline-[#848484] dark:outline-1 hover:shadow-md transition ease-in-out duration-200 hidden sm:flex cursor-pointer xl:py-[0.5vh] lg:pr-3 lg:mr-[10vw] xl:mr-[18vw] md:mr-[12vw]">
            <input
              className="rounded-md px-3 outline-none w-[25vw] md:w-[28vw] lg:w-[27vw] placeholder-transparent text-black sm:py-[0.4vh]  md:py-[0.9vh] lg:py-[0.6vh] xl:py-[0.6vh] text-md font-poppins lg:text-base md:text-xs lg:px-6 relative z-10 bg-transparent"
              type="text"
              value={search}
              onChange={handleSearchBar}
            />
            {search === "" && (
              <span
                className={`absolute left-4 lg:left-6 flex items-center gap-1 md:text-sm xl:text-base lg:text-sm`}
              >
                <span className="text-gray-500 dark:text-[#64707D]">
                  Search for
                </span>
                <span
                  className={` text-[#364EF2] pointer-events-none transition-opacity duration-500 z-0 ${
                    fade ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {placeholderWords[placeholderIndex]}
                </span>
              </span>
            )}
            <CiSearch
              size={22}
              className="text-black size-4 lg:size-5 mr-2 cursor-pointer dark:text-[#64707D]"
            />
          </div>

          <div className="hidden items-center text-[1.9vw] sm:flex gap-8 md:gap-6 lg:gap-8 font-medium xl:gap-6">
            <div className="flex justify-center items-center text-[1.5vw] sm:gap-5 lg:gap-8 xl:gap-5">
              <button
                onClick={goToSignup}
                className="md:text-[1.7vw] xl:text-base font-poppins dark:text-white lg:text-sm mr-3"
              >
                Sign up
              </button>
              <button
                onClick={goToLogin}
                className="transition duration-200 md:text-[1.7vw] xl:text-base font-poppins bg-black text-white xl:px-6 xl:py-[1.1vh] rounded-full dark:bg-white dark:text-black md:py-[0.7vh] md:px-5 lg:py-[0.6vh] lg:text-sm"
              >
                Login
              </button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
