const mongoose = require("mongoose");

const Retailer = new mongoose.Schema({
    dealerName: {
        type: String,
        require: true
    },
    street: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    make: Array,
    model: Array,
    car: Array

});

module.exports = mongoose.model("Retailer", Retailer);