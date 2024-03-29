const mongoose = require("mongoose");

const Retailer = new mongoose.Schema({
    images: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
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
    zip:String,
    make: Array,
    model: Array,
    car: Array,
    testDrive: {
        type: Boolean,
        default: false
    }

});

module.exports = mongoose.model("Retailer", Retailer);