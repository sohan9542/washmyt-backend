const Retailer = require("../models/retailerModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const productModel = require("../models/productModel");
const zipcodes = require('zipcodes');

exports.newRetailer = catchAsyncErrors(async (req, res, next) => {
  const retailer = await Retailer.create(req.body);

  res.status(201).json({
    success: true,
    retailer,
  });
});

exports.getAllRetailer = catchAsyncErrors(async (req, res, next) => {
  const retailerdem = await Retailer.find().sort({
    createdAt: -1,
  });

  let retailer = [];

  let product = await productModel.find();

  retailerdem.map((item) => {
    let dpro = product.filter((i) => i.id == item.car)[0];
    // console.log(dpro);
    retailer = [
      ...retailer,
      {
        retailer: item,
        product: dpro,
      },
    ];
  });

  res.status(200).json({
    success: true,
    retailer,
  });
});

exports.getRetailer = catchAsyncErrors(async (req, res, next) => {
  const retailer = await Retailer.findById(req.params.id);

  if (!retailer) {
    return next(new ErrorHander("Retailer not found", 404));
  }
  const product = await productModel.findById(req.params.pid);

  res.status(200).json({
    success: true,
    retailer,
    product,
  });
});
exports.getRetailerOnly = catchAsyncErrors(async (req, res, next) => {
  const retailer = await Retailer.findById(req.params.id);

  if (!retailer) {
    return next(new ErrorHander("Retailer not found", 404));
  }
  const product = await productModel.find();
  let products = [];
  retailer.car.map((i) => {
    let dp = product.filter((pro) => pro.id === i)[0];
    products = [...products, dp];
  });
  res.status(200).json({
    success: true,
    retailer,
    products,
  });
});

// delete Order -- Admin
exports.deletePromo = catchAsyncErrors(async (req, res, next) => {
  const newRetailer = await Retailer.findById(req.params.id);

  if (!newRetailer) {
    return next(new ErrorHander("Retailer not found with this Id", 404));
  }

  await newRetailer.remove();

  res.status(200).json({
    success: true,
  });
});

exports.searchRetailer = catchAsyncErrors(async (req, res, next) => {
  let newRetailer = await Retailer.find();
  let body = req.body;
  if (body.make) {
    newRetailer = newRetailer.filter((item) => item.make.find(e=> e === body.make.toLowerCase()) === body.make.toLowerCase());
  }
  if (body.model) {
    newRetailer = newRetailer.filter((item) => item.model.find(e=> e === body.model.toLowerCase()) === body.model.toLowerCase());
  }
  const distance = (zip1, zip2)=>{
    let dis = zipcodes.distance(zip1, zip2);
    // console.log(dis)
    return dis;
  }
  if (body.zip) {
    newRetailer = newRetailer.filter((item) => distance(parseInt(body.zip), parseInt(item.zip)) <= 50);
  }

  res.status(200).json({
    success: true,
    result: newRetailer,
  });
});

exports.updateRetailer = catchAsyncErrors(async (req, res, next) => {
  let retailer = await Retailer.findById(req.params.id);

  if (!retailer) {
    return next(new ErrorHander("Retailer not found", 404));
  }

  retailer = await Retailer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    retailer,
  });
});