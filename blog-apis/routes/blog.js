const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
// const roleAccess = require("../middlewares/roleAccess");
const {
  allBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  myBlogs,
} = require("../controllers/blog");
const router = express.Router();

router.get("/", verifyToken, allBlogs);
router.post("/", verifyToken, createBlog);
router.get("/:id", verifyToken, getBlog);
router.patch("/:id", verifyToken, updateBlog);
router.delete("/:id", verifyToken, deleteBlog);
router.get("/my-blogs", verifyToken, myBlogs);

module.exports = router;
