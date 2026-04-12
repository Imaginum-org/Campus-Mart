import * as reportService from "../services/report.service.js";

export const reportProduct = async (req, res, next) => {
  try {
    const user = req.user;
    const { productId } = req.params;
    const data = req.body;

    const report = await reportService.reportProduct(productId, data, user);

    return res.status(201).json({
      success: true,
      message: "Product reported successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};
