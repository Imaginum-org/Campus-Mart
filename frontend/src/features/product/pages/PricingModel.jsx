// import Header from "../../../Components/Header";
import toast, { Toaster } from "react-hot-toast";
import { CircleCheck } from "lucide-react";
import { LuDot } from "react-icons/lu";
// import bag from "../assets/bag.png";
// import bluebag from "../assets/bluebag.png";

const PricingModel = () => {
  const handlePurchase = () => {
    toast("Coming Soon!", { id: "pricing-toast" });
  };

  const plans = [
    {
      title: "Current",
      desc: "Perfect for exploring the platform and listing your first few items.",
      features: [
        "List up to 5 products for free",
        "Access basic buyer/seller features",
        "Track orders and listings",
        "Get community support",
      ],
      price: "Free",
      status: "Activated",
      isGradient: false,
      isActive: true,
    },
    {
      title: "Pro",
      desc: "For active sellers and buyers looking to expand. Ideal for users who want additional perks and tools to grow their sales.",
      features: [
        "Unlimited product listings",
        "Advanced product tracking",
        "Priority support",
        "In-app messaging and notifications",
        "Access to detailed analytics",
      ],
      price: "49",
      status: "Continue",
      isGradient: true,
      isActive: false,
      tag: "Popular",
    },
    {
      title: "Pro Plus",
      desc: "Ideal for users who want additional perks and tools to grow their sales.",
      features: [
        "Everything in Growth Plan",
        "Featured product placement",
        "Exclusive promotional tools",
        "Advanced analytics and insights",
      ],
      price: "99",
      status: "Continue",
      isGradient: false,
      isActive: false,
    },
  ];

  return (
    <div className="flex flex-col relative w-full min-h-screen overflow-hidden dark:bg-[#131313]">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 1500,
          maxToasts: 1,
        }}
      />

      {/* <Header bagUrl={bag} darkUrl={bluebag} /> */}

      {/* Decorative Image */}
      <img
        className="absolute w-[28vw] h-[50vh] bottom-[-35vh] left-[-11vw] hidden xl:block"
        src="/assets/Group_114.png"
        alt="background-shape"
      />

      {/* Heading Section */}
      <div className="text-center mt-9 px-4">
        <h1 className="text-[#353535] dark:text-white font-bold text-[5vw] sm:text-3xl md:text-2xl xl:text-2xl font-robotoFlex leading-tight">
          Find the Perfect Plan for Your Needs!
        </h1>
        <p className="text-[#8F8F8F] w- dark:text-[#848484] mt-2 text-[3.5vw] sm:text-xl md:text-lg xl:text-base font-poppins">
          Select from flexible plans designed for students, sellers, and buyers.
          Whether you&apos;re just getting started <br /> or need advanced
          features, we&apos;ve got you covered!
        </p>
      </div>

      {/* Cards Section */}
      <div className="w-full flex flex-col xl:flex-row items-center justify-center gap-6 px-4 md:px-12 xl:px-32 mt-10 mb-14">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`
              w-[85vw] sm:w-[65vw] md:w-[50vw] xl:w-[28vw]
              rounded-xl shadow-md p-5 flex flex-col gap-4
              ${
                plan.isGradient
                  ? "bg-gradient-to-bl from-[#464ff2] to-[#282d8c] text-white"
                  : "bg-white dark:bg-[#1A1D20] text-black dark:text-white dark:shadow-none dark:outline dark:outline-1 dark:outline-offset-[-0.95px] dark:outline-[#D7D7D7]"
              }
            `}
          >
            {/* Title and Optional Tag */}
            <div className="flex items-center gap-2">
              <div
                className={`${
                  plan.isGradient
                    ? "bg-white text-black"
                    : "bg-gradient-to-br from-indigo-600 to-blue-600 text-white"
                } font-semibold rounded-md px-7 py-[0.8vh] text-sm w-fit`}
              >
                {plan.title}
              </div>
              {plan.tag && (
                <span className="text-base font-semibold text-[#FFE500]">
                  {plan.tag}
                </span>
              )}
            </div>

            {/* Description */}
            <p
              className={`${
                plan.isGradient
                  ? "text-white"
                  : "text-neutral-500 dark:text-[#D7D7D7]"
              } text-sm lg:text-base`}
            >
              {plan.desc}
            </p>

            {/* Features */}
            <ul className="mt-2 space-y-2 text-sm lg:text-base">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  {plan.isGradient ? (
                    <CircleCheck size={18} className="mr-2" />
                  ) : (
                    <LuDot size={24} />
                  )}
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Price and Button */}
            <div className="mt-8">
              <h2
                className={`text-3xl md:text-4xl font-tiltWarp ${
                  plan.isGradient ? "text-white" : "text-black dark:text-white"
                }`}
              >
                {plan.price === "Free" ? (
                  "Free"
                ) : (
                  <>
                    <span className="xl:text-4xl text-3xl font-roboto pr-1">
                      ₹
                    </span>
                    <span className="xl:text-5xl text-4xl">{plan.price}</span>
                  </>
                )}
              </h2>
              <hr className="border-[#8e8e8e] my-2" />

              {plan.isActive ? (
                <div className="border border-[#8e8e8e] rounded-md py-2 text-center text-sm mt-2 xl:text-base">
                  {plan.status}
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  className={`${
                    plan.isGradient
                      ? "bg-white text-black"
                      : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
                  } rounded-md py-2 text-sm xl:text-base w-full font-semibold`}
                >
                  {plan.status}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingModel;
