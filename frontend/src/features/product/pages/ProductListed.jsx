import Profile_left_part from "../../../features/user/components/Profile_left_part.jsx";
import TabSwitcher from "../../../features/user/components/manageorderanime.jsx";
import OrderCard from "../../../features/user/components/OrderCard.jsx";
import { useState, useMemo, useEffect } from "react";
import { MdShoppingBag } from "react-icons/md";
import { getUserProducts } from "../api/productApi.js";
import toast from "react-hot-toast";
import Loader from "../../../Components/ui/Loader.jsx";

function ProductListed() {
  const [activeTab, setActiveTab] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProducts();
  }, []);

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getUserProducts();

      if (res.data.success) {
        setProducts(res.data.data || []);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch products");
      toast.error("Failed to load your products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const tab = (activeTab || "All").toLowerCase().trim();

    if (tab === "all") return products;

    return products.filter((p) => {
      const productStatus = (p.status || "").toLowerCase().trim();
      return productStatus === tab;
    });
  }, [activeTab, products]);

  const handleProductDeleted = (productId) => {
    setProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const handleProductUnlisted = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, status: "UNLISTED" } : p)),
    );
  };

  const handleProductRelisted = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, status: "LISTED" } : p)),
    );
  };

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
                <span> My Listed Products</span>
              </div>
              <div>
                <TabSwitcher
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader />
              </div>
            ) : error ? (
              <div className="py-8 text-center text-red-500 dark:text-red-400">
                {error}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                No products found for "{activeTab}"
              </div>
            ) : (
              filteredProducts.map((p) => (
                <OrderCard
                  key={p._id}
                  orderId={p._id}
                  placedOn={new Date(p.createdAt).toLocaleDateString()}
                  imageUrl={p.images?.[0] || "/image10.png"}
                  name={p.title}
                  color={p.attributes?.color || "N/A"}
                  attr={p.attributes?.usage_duration || "N/A"}
                  status={p.status}
                  price={p.selling_price}
                  onProductDeleted={handleProductDeleted}
                  onProductUnlisted={handleProductUnlisted}
                  onProductRelisted={handleProductRelisted}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductListed;
