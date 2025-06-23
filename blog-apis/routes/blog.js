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
const checkCache = require("../middlewares/checkCache");
const router = express.Router();

router.get("/", verifyToken, checkCache, allBlogs);
router.get("/my-blogs", verifyToken, checkCache, myBlogs);
router.post("/", verifyToken, createBlog);
router.get("/:id", verifyToken, getBlog);
router.patch("/:id", verifyToken, updateBlog);
router.delete("/:id", verifyToken, deleteBlog);

module.exports = router;
