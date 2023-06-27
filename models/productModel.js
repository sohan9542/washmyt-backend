const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  make: {
    type: String,
    required: [true, "Please Enter make"],
  },
  model: {
    type: String,
    required: [true, "Please Enter model"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter  Price"],
  },
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
  customize: {
    type: String,
  },
  delivery: {
    type: String,
  },
  options: [
    {
      name: {
        type: String,
      },
      bodytype: {
        type: String,
      },
      powertraintype: {
        type: String,
      },
      transmission: {
        type: String,
      },
      drivetrain: {
        type: String,
      },
      range: {
        type: String,
      },
      power: {
        type: String,
      },
      acceleration: {
        type: String,
      },
      fastcharging: {
        type: String,
      },
      homecharging: {
        type: String,
      },
      seats: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
