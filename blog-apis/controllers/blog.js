const asyncHandler = require("express-async-handler");
const { Blog } = require("../models/blog");

const allBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
  const total = await Blog.countDocuments({});

  //   if (role === "admin") {
  //     blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
  //     total = await Blog.countDocuments();
  //   } else {
  // }

  return res
    .status(200)
    .json({ success: true, data: blogs, totalItems: total });
});

const myBlogs = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const blogs = await Blog.find({ userId: userId })
    .sort({ createdAt: -1 })
    .lean();
  const total = await Blog.countDocuments({ userId: userId });

    return res
    .status(200)
    .json({ success: true, data: blogs, totalItems: total });
});

const createBlog = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const { name, slug, content, tags, coverImage } = req.body;

  if (!name || !slug || !content || !Array.isArray(tags) || !coverImage) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const existingBlog = await Blog.findOne({ slug });

  if (existingBlog) {
    return res.status(409).json({
      success: false,
      message: "A blog with this slug already exists",
    });
  }

  const blog = await Blog.create({
    name,
    slug,
    content,
    tags,
    coverImage,
    userId,
  });

  return res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: blog,
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id: user_id } = req.user;
  const { id: BlogId } = req.params;

  const { userId } = req.body;

  if (user_id !== userId) {
    return res
      .status(404)
      .json({ success: false, message: "Not allowed to edit the blog" });
  }

  const blog = await Blog.findOneAndUpdate({ _id: BlogId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    return res.status(404).json({ success: false, message: "No Blog Found" });
  }

  return res.status(200).json({
    success: true,
    message: "Blog Successfully Updated",
    data: blog,
  });
});

const getBlog = asyncHandler(async (req, res) => {
  const { id: BlogId } = req.params;

  const blog = await Blog.findOne({ _id: BlogId });

  console.log(blog.userId.toString());

  if (!blog) {
    return res.status(404).json({ success: false, message: "No Blog Found" });
  }

  res.status(200).json({ success: true, data: blog });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id: user_id, role } = req.user;
  const { id: BlogId } = req.params;

  const blog = await Blog.findOne({ _id: BlogId });
  const userId = blog.userId.toString();

  if (role === "admin" || user_id === userId) {
    const blog = await Blog.findOneAndDelete({ _id: BlogId });

    if (!blog) {
      return res.status(404).json({ success: false, message: "No Blog Found" });
    }
  } else {
    return res
      .status(404)
      .json({ success: false, message: "No Allowed to delete the Blog" });
  }

  res.status(200).json({ success: true, message: "Blog Successfully Deleted" });
});

module.exports = {
  allBlogs,
  createBlog,
  updateBlog,
  getBlog,
  deleteBlog,
  myBlogs
};
