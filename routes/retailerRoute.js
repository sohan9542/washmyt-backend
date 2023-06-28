const express = require("express");
const {
    newRetailer,
    getAllRetailer,
    deletePromo,
    getRetailer,
    searchRetailer,
    getRetailerOnly,
    updateRetailer
} = require("../controllers/RetailerController");
const router = express.Router();

const {
    isAuthenticatedUser
} = require("../middleware/auth");

router.route("/admin/retailer/new").post(isAuthenticatedUser, newRetailer);

router
    .route("/admin/retailer")
    .get(getAllRetailer);

router
    .route("/retailer/:id")
    .get(getRetailerOnly);

router
    .route("/retailer/:id/:pid")
    .get(getRetailer);
router
    .route("/retailer/find")
    .post(searchRetailer);


router
    .route("/admin/retailer/:id")
    .delete(isAuthenticatedUser, deletePromo)
    .put(updateRetailer);

module.exports = router;