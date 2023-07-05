const express = require("express");
const {
  newCategory,

  getAllCategory,

  deleteCategory,
  updateCategory,
  getCategoryDetails,
} = require("../controllers/categoryController");
const router = express.Router();

const {
  isAuthenticatedUser
} = require("../middleware/auth");

router.route("/admin/category/new").post(isAuthenticatedUser, newCategory);

router
  .route("/category")
  .get(getAllCategory);

router
  .route("/category/model")
  .get(getCategoryDetails);

router
  .route("/admin/category/:id")
  .put(isAuthenticatedUser, updateCategory)
  .delete(isAuthenticatedUser, deleteCategory);

module.exports = router;