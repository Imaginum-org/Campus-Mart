export const validate = (schema) => (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    req.body = data; // sanitized data
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.errors,
    });
  }
};
