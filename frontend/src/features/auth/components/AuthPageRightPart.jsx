import { IoIosSunny, IoMdMoon } from "react-icons/io";
import { useTheme } from "../../../context/ThemeContext.jsx";

import Image4 from "../../../assets/upper_circle_1.png";
import Image5 from "../../../assets/rectangle_1.png";
import Image6 from "../../../assets/rectangle_2.png";
import Image7 from "../../../assets/Homepage.png";

function AuthPageRightPart() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="h-screen w-[0%] lg:w-[62%] relative overflow-hidden bg-gradient-to-l from-[#364EF2] to-[#534ff2]">
      <button
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
        className="transition duration-500 ease-in-out absolute right-[8%] top-[34.4%] z-20"
      >
        {darkMode ? (
          <IoIosSunny className="text-[#FFD119] lg:size-6" />
        ) : (
          <IoMdMoon className="text-[#323232] lg:size-6" />
        )}
      </button>

      {/* UI unchanged */}
      <div className="absolute font-figtree top-[12%] left-[27%] text-[#ffffd5] text-[40px] font-black tracking-tight leading-tight">
        Find What You Need, <br />
        Sell What You Don&apos;t!
      </div>

      <img src={Image6} className="absolute top-[-4%] left-[-10%] w-[55vw]" />
      <img src={Image5} className="absolute top-[18%] left-[-13%] w-[55vw]" />
      <img src={Image4} className="absolute top-0 right-0 w-[10vw]" />
      <img src={Image7} className="absolute bottom-0 right-0 w-[46vw]" />
    </div>
  );
}

export default AuthPageRightPart;
