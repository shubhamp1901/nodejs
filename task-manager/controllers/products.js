const { createCustomError } = require("../errors/custom-error");
const asyncWrapper = require("../middleware/async");
const { Product } = require("../models/Product");

const getAllProducts = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 2
    const skip = (page - 1) * limit;


    let products = await Product.find({}).skip(skip).limit(limit);

    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;


    res.status(200).json({ success: true, data: products, hasNext });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products list" });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json({
      success: true,
      message: "Successfully added a new product",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product" });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No Product with ${productId} found`,
        data: null,
      });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No Product with ${productId} found`,
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Successfully updated the product",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOneAndDelete({ _id: productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No Product with ${productId} found`,
      });
    }
    res.status(200).json({ msg: "Successfully deleted the product" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete the product" });
  }
};

const filterProducts = async (req, res) => {
  try {
    // select will only return name price and .select('-_id -rating') // returns all fields except _id and rating
    // .sort('price') ascending ('-price') descending
    const products = await Product.find({ price: { $lt: 50000 } })
      .sort("-price")
      .select("name price");
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products list" });
  }
};

const getAllProductsFilter = async (req, res) => {
  try {
    const { featured, company, name, filter } = req.query;
    const queryObj = {};

    if (featured) {
      queryObj.featured = featured === "true" ? true : false;
    }

    if (company) {
      queryObj.company = company;
    }

    if (name) {
      // Makes the regex case-insensitive (i stands for "ignore case").
      queryObj.name = { $regex: name, $options: "i" }; // case-insensitive partial match
    }

    let result = Product.find(queryObj);

    // Don't call .sort() on a resolved array.
    // Only use .sort() on a Mongoose query object, before await.
    if (filter) {
      const sortList = filter.split(",").join(" ");
      result = result.sort(sortList);
    } else {
      result = result.sort("createdAt");
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 1;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products list" });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  filterProducts,
  getAllProductsFilter,
};
