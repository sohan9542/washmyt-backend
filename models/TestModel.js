const mongoose = require("mongoose");

const testDriveSchema = new mongoose.Schema({
    firstName:String,
    lastName: String,
    email: String,
    phone: String,
    zipCode: String,
    dateSelect: Date,
    timeSelect: String,
    retailerId: String,
    productId: String

});

module.exports = mongoose.model("TestDrive", testDriveSchema);