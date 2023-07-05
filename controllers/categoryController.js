const Category = require("../models/CategoryModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const retailerModel = require("../models/retailerModel");
const productModel = require("../models/productModel");

exports.newCategory = catchAsyncErrors(async (req, res, next) => {
  const { title, subcategory } = req.body;

  const category = await Category.create({
    title,
    subcategory,
  });

  res.status(201).json({
    success: true,
    category,
  });
});

exports.getAllCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await productModel.find();
  let make = [];
  category.map((item) => {
    let demMake = make.filter((i) => i === item.make);
    if (demMake.length === 0) {
      make = [...make, item?.make];
    }
  });
  res.status(200).json({
    success: true,
    make,
  });
});

exports.getCategoryDetails = catchAsyncErrors(async (req, res, next) => {
  let make = req.query.make;
  const category = await productModel.find();
  const makeCategory = category.filter((item)=> item?.make == make)
  let model = [];
  makeCategory.map((item) => {
    let demModel = model.filter((i) => i === item.model);
    if (demModel.length === 0) {
      model = [...model, item?.model];
    }
  });

  if (!category) {
    return next(new ErrorHander("Category not found", 404));
  }

  res.status(200).json({
    success: true,
    model
  });
});

exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHander("Category not found", 404));
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    category,
  });
});
// delete Order -- Admin
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHander("Category not found with this Id", 404));
  }

  await category.remove();

  res.status(200).json({
    success: true,
  });
});
