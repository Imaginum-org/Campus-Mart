import Product from "../models/Product.model.js";

export const createProduct = async (data, user) => {
  // 1. Attach seller
  data.seller_id = user._id;

  // 2. Handle location (if user has location)
  if (user.current_lat && user.current_long) {
    data.location = {
      type: "Point",
      coordinates: [user.current_long, user.current_lat],
    };
  }

  // 3. Handle attributes safely
  if (data.attributes) {
    if (data.attributes.purchase_date) {
      data.attributes.purchase_date = new Date(data.attributes.purchase_date);
    }
  }

  // 4. Business validation (extra safety)
  if (data.original_price && data.selling_price > data.original_price) {
    throw new Error("Selling price cannot be greater than original price");
  }

  // 5. Create product
  const product = await Product.create(data);

  return product;
};
