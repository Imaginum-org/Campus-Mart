import { motion } from "framer-motion";

const tabs = ["All", "In progress", "Delivered"];

export default function TabSwitcher({ activeTab, setActiveTab }) {
  return (
    <div className="hidden lg:flex items-center space-x-1 bg-white dark:bg-[#1A1D20] rounded-[9.61px] shadow-[0px_3.2039802074432373px_6.407960414886475px_0px_rgba(0,0,0,0.06)] px-[0.5vw] py-[0.6vh]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className="relative py-[0.5vh] px-[0.7vw] text-[0.85rem] font-medium font-['Poppins'] transition-colors duration-200 xl:py-1 xl:px-4"
          aria-pressed={activeTab === tab}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-[#394ff1] rounded-[5px]"
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
            />
          )}
          <span
            className={`relative z-10 ${
              activeTab === tab
                ? "text-white text-[0.85rem] font-light"
                : "text-[#292929] dark:text-[#D6D6D6] text-[0.85rem] font-light"
            }`}
          >
            {tab}
          </span>
        </button>
      ))}
    </div>
  );
}
