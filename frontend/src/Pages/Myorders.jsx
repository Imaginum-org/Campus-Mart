import React, { useState, useMemo } from "react";
import Profile_left_part from "../Components/Profile_left_part";
import Image1 from "../assets/earphone.png";
import TabSwitcher from "../Components/manageorderanime.jsx";
import Header from "../Components/Header";
import bag from "../assets/bag.png";
import bluebag from "../assets/bluebag.png";
import { MdShoppingBag } from "react-icons/md";
import OrderCard from "../Components/OrderCard.jsx";

function Myorders() {
  const [activeTab, setActiveTab] = useState("All");

  const [orders] = useState([
    {
      id: "130525-01",
      placedOn: "13-05-2025",
      imageUrl: Image1,
      name: "Ear Buds",
      color: "Blue color",
      attr: "Wireless",
      status: "In progress",
      price: "750",
    },
    {
      id: "130525-02",
      placedOn: "14-05-2025",
      imageUrl: Image1,
      name: "Ear Buds Pro",
      color: "Black",
      attr: "Wireless",
      status: "cancelled",
      price: "1150",
    },
    {
      id: "130525-03",
      placedOn: "15-05-2025",
      imageUrl: Image1,
      name: "Ear Buds Plus",
      color: "White",
      attr: "Wireless",
      status: "Delivered",
      price: "950",
    },
  ]);

  const filteredOrders = useMemo(() => {
    const tab = (activeTab || "All").toLowerCase().trim();
    if (tab === "all") return orders;
    if (tab === "in progress" || tab === "inprogress")
      return orders.filter(
        (o) => (o.status || "").toLowerCase().trim() === "in progress"
      );
    if (tab === "delivered")
      return orders.filter(
        (o) => (o.status || "").toLowerCase().trim() === "delivered"
      );
    return orders;
  }, [activeTab, orders]);

  return (
    <div className="h-screen w-full dark:bg-[#131313] flex flex-col">
      {/* <Header bagUrl={bag} darkUrl={bluebag} /> */}

      <div className="flex-1 lg:flex md:flex overflow-hidden">
        <div className="hidden md:block md:w-[37%] lg:w-[28%] xl:w-[26%] pt-[3.5vh] pl-[2vw] pr-[1.75vw] pb-[2vh] bg-[#FBFBFB] dark:bg-[#131313] xl:pt-[2.5vh] xl:-mr-4 xl:pb-0">
          <Profile_left_part />
        </div>
        <div className="h-full md:w-[63%] lg:w-[72%] xl:w-[73.5%] overflow-y-auto no-scrollbar bg-[#FBFBFB] dark:bg-[#131313]">
          <div className="mx-[5.5vw] md:mr-[3vw] md:ml-[2vw] lg:mr-[3.2vw] lg:ml-[1.5vw] xl:ml-[3vw]">
            <div className="flex justify-between items-center">
              <div className="text-[1.1rem] mb-[2vh] mt-[3vh] lg:mt-[5vh] lg:mb-[2vh] text-[#292929] dark:text-[#D6D6D6] xl:text-[1.3rem] lg:text-[22px] lg:font-medium font-poppins flex items-center justify-center">
                <p className="mr-[0.8vw]">
                  <MdShoppingBag size={25} />
                </p>
                <span> My Orders</span>
              </div>
              <div>
                <TabSwitcher
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                No orders found for "{activeTab}"
              </div>
            ) : (
              filteredOrders.map((o) => (
                <OrderCard
                  key={o.id}
                  orderId={o.id}
                  placedOn={o.placedOn}
                  imageUrl={o.imageUrl}
                  name={o.name}
                  color={o.color}
                  attr={o.attr}
                  status={o.status}
                  price={o.price}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Myorders;
