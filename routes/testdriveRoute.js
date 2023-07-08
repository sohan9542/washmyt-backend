const express = require("express");
const {
  newTestDrive,
  getAllTestDrive,
  deleteTestDrive,
} = require("../controllers/testdriveController");
const router = express.Router();

const {
  isAuthenticatedUser
} = require("../middleware/auth");

router.route("/testdrive").post(newTestDrive);

router
  .route("/admin/testdrive")
  .get(getAllTestDrive);

router
  .route("/admin/testdrive/:id")
  .delete(isAuthenticatedUser, deleteTestDrive);

module.exports = router;