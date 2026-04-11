import * as productService from "../services/product.service.js";

export const createProduct = async (req, res, next) => {
  try {
    const user = req.user; // from auth middleware
    const data = req.body;

    const product = await productService.createProduct(data, user);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
