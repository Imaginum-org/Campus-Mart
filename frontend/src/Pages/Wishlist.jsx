import Profile_left_part from "../Components/Profile_left_part";
import Header from "../Components/Header";
import bag from "../assets/bag.png";
import bluebag from "../assets/bluebag.png";
import ProductCard from "../Components/ProductCard";

function Wishlist() {
  return (
    <>
      <div className="w-screen h-screen overflow-hidden dark:bg-[#131313]">
        {/* <Header bagUrl={bag} darkUrl={bluebag} /> */}

        <div className="flex h-[calc(100vh-70px)]">
          <div className="hidden md:block md:w-[37%] lg:w-[28%] xl:w-[26%] pt-[3.5vh] pl-[2vw] pr-[1.75vw] pb-[2vh] bg-[#FBFBFB] dark:bg-[#131313] xl:pt-[2.5vh] xl:-mr-4 xl:pb-0">
            <Profile_left_part />
          </div>

          <div className="h-full md:w-[63%] lg:w-[72%] xl:w-[73.5%] overflow-y-auto no-scrollbar bg-[#FBFBFB] dark:bg-[#131313]">
            <div className="mx-[5.5vw] md:mx-[1.7vh] lg:mr-[3.2vw] lg:ml-[1.5vw]">
              <div
                className="justify-start text-zinc-800 lg:text-2xl dark:bg-[#131313] 
          font-['Poppins'] dark:text-[#D6D6D6] mb-[2vh] mt-[3vh]  
          lg:mt-[5.5vh] lg:mb-[2vh] text-[1.1rem] lg:font-medium"
              >
                Wishlist
              </div>

              <div
                className="w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3  
          gap-x-4 gap-y-7 dark:bg-[#131313]"
              >
                <ProductCard />
                <ProductCard />
                <ProductCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Wishlist;
