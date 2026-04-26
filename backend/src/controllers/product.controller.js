import * as productService from "../services/product.service.js";
import { deleteImage } from "../utils/imagekit.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  const fileIds = Array.isArray(req.body.image_file_ids)
    ? req.body.image_file_ids
    : [];

  try {
    const user = req.user;
    const data = req.body;

    const product = await productService.createProduct(data, user);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    // Cleanup uploaded images if product fails
    if (fileIds.length > 0) {
      await Promise.all(fileIds.map((id) => deleteImage(id)));
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Product creation failed",
    });
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res, next) => {
  try {
    const result = await productService.getAllProducts(req.query);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      ...result, // keep for frontend
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res, next) => {
  try {
    const product = await productService.getSingleProduct(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// GET BOOSTED PRODUCTS
export const getBoostedProducts = async (req, res, next) => {
  try {
    const products = await productService.getBoostedProducts();

    return res.status(200).json({
      success: true,
      message: "Boosted products fetched successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;

    // Prevent unnecessary DB calls
    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const suggestions = await productService.getSearchSuggestions(q);

    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};
