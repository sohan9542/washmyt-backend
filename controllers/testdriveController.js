// Create new Order

const Test = require("../models/TestModel");
const Product = require("../models/productModel");
const Retailer = require("../models/retailerModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.newTestDrive = catchAsyncErrors(async (req, res, next) => {
  const testDrive = await Test.create(req.body);

  res.status(201).json({
    success: true,
    testDrive,
  });
});

exports.getAllTestDrive = catchAsyncErrors(async (req, res, next) => {
  const testDrives = await Test.find();
  const products = await Product.find();
  const retailer = await Retailer.find();

  let testdata = []



  testDrives?.map((item)=>{
    let fullData = {
      userData: {},
      product: {},
      retailer: {}
    }
    fullData.product = products.filter(i=> i?._id == item?.productId)?.[0]
    fullData.retailer = retailer.filter(i=> i?._id == item?.retailerId)?.[0]
    fullData.userData = item

    testdata = [...testdata, fullData]
  })

  res.status(200).json({
    success: true,
    testdata,
  });
});


exports.deleteTestDrive = catchAsyncErrors(async (req, res, next) => {
    const order = await Test.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }
  
    await order.remove();
  
    res.status(200).json({
      success: true,
    });
  });