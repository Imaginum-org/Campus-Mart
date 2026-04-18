import * as productService from "../services/product.service.js";
import { deleteImage } from "../utils/imagekit.js";

export const createProduct = async (req, res) => {
  const fileIds = Array.isArray(req.body.image_file_ids)
    ? req.body.image_file_ids
    : [];

  try {
    const user = req.user;
    const data = req.body;

    // validate first
    if (!data.images || data.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Images are required",
      });
    }

    const product = await productService.createProduct(data, user);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    // cleanup uploaded images
    if (fileIds.length > 0) {
      await Promise.all(fileIds.map((id) => deleteImage(id)));
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Product creation failed",
    });
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const result = await productService.getAllProducts(req.query);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

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
