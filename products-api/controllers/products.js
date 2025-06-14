const asyncHandler = require("express-async-handler");
const { Product } = require("../model/products");

const getAllProducts = asyncHandler(async (req, res) => {

  const queryObj = { ...req.query };
  console.log(queryObj)
  const excludeFields = ['sort', 'page', 'limit']
  excludeFields.forEach((field) => delete queryObj[field])
  
  if (req.query.maxPrice) {
    queryObj.price = { $lte: parseInt(queryObj.maxPrice)}
    delete queryObj.maxPrice
  }

  let sortQueries;
  if (req.query.sort) {
    sortQueries = req.query.sort.split(',').join(' ')
  } else {
    sortQueries = '-createdAt'
  }

  const page = req.query.page || 1
  const limit = req.query.limit || 2
  const skip = (page - 1) * limit;

  const total = await Product.find(queryObj).countDocuments();
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;

  if (page > totalPages) {
    res.status(400).json({success: false, message: "Page does not exist"})
    // throw new Error("Page does not exist")
  }

  // console.log(queryObj)
  const data = await Product.find(queryObj).sort(sortQueries).select(['name', 'description', 'price', 'rating']).skip(skip).limit(limit);
  res.status(200).json({ success: true, data: data, hasNext });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, inStock, rating, brand, tags } =
    req.body;

  if (!name || !price) {
    return res
      .status(400)
      .json({ message: "Name and price are required fields." });
  }

  const newProduct = new Product({
    name,
    description,
    category,
    price,
    inStock,
    rating,
    brand,
    tags,
  });

  const savedProduct = await newProduct.save();

  res.status(201).json({
    message: "Product created successfully!",
    product: savedProduct,
  });
});

module.exports = {
  getAllProducts,
  createProduct,
};
