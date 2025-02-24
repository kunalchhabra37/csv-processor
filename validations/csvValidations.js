const path = require("path");
const joi = require("joi");
const Joi = require("joi");
const { validateJoi } = require("../utils/validate");
const validateFileType = (file) => {
  try {
    const extension = path.extname(file.originalname);
    return extension === ".csv";
  } catch (error) {
    console.log("validateFileType error::", error);
    throw error;
  }
};

const validateStructure = (data) => {
  try {
    const response = {
      status: false,
      message: `Incorrect file header sent, please send: 'S. No.', 'Product Name', 'Input Image Urls'`,
    };
    if (!data.length) {
      response.message = "File is empty";
    }

    const fileHeaders = {
      "S. No.": true,
      "Product Name": true,
      "Input Image Urls": true,
    };
    const keys = Object.keys(data[0]);
    if (keys.length !== 3) {
      return response;
    }
    for (let key of keys) {
      if (!fileHeaders[key]) {
        return response;
      }
    }
    return {
      status: true,
      message: "Data validated successfully",
    };
  } catch (error) {
    console.log("validateStructure error::", error);
    throw error;
  }
};

const validateCsvData = (data) => {
  const schema = Joi.array()
    .min(1)
    .items(
      Joi.object({
        "S. No.": Joi.string()
          .required()
          .messages({ "string.empty": "Some Serial No. are empty" }),
        "Product Name": Joi.string()
          .required()
          .messages({ "string.empty": "Some Product Names are empty" }),
        "Input Image Urls": Joi.string()
          .required()
          .messages({ "string.empty": "Some Input Images are empty are empty" }),
      })
    )
    .messages({
      "array.min": "No records sent",
    });
    return validateJoi(schema, data)
};

module.exports = {
  validateFileType,
  validateStructure,
  validateCsvData
};