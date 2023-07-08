const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const cloudinary = require("cloudinary");

// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];



  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    // console.log(req.body.images)
    images = req.body.images;
  }


  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }


  req.body.images = imagesLinks;


  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product
exports.searchProducts = catchAsyncErrors(async (req, res, next) => {

  let products;

  products = await Product.find();

  const query = req.query.search;
  // Create copy of item list
  var updatedList = [...products];
  // Include all elements which includes the search query
  updatedList = updatedList.filter((item) => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  // Trigger render with updated values
  products = updatedList


  res.status(200).json({
    success: true,
    products,

  });
});


exports.getAllProductsPost = catchAsyncErrors(async (req, res, next) => {

  let body = req.body
  let currentPageSize = parseInt(req.query.size);


  let url = `${process.env.LOCAL_URI}/api/v1/products?size=${currentPageSize + 8}`
  let url2 = `${process.env.LOCAL_URI}/api/v1/products?size=${currentPageSize - 8}`

  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  let products;

  if (req.query.new) {
    url = url + '&new=true'
    url2 = url2 + '&new=true'
    products = await Product.find().sort({
      createdAt: -1
    });
  } else {
    products = await Product.find();
  }

  if (req.query.high) {
    url = url + '&high=true'
    url2 = url2 + '&high=true'
    products = await Product.find().sort('-price');
  }
  if (req.query.low) {
    url = url + '&low=true'
    url2 = url2 + '&low=true'
    products = await Product.find().sort('price');
  }


  if (body.category) {
    products = products.filter(item => item.productType === body.category)
  }
  if (body.subcategory) {


    let findtag = (firstArray, secondArray) => {
      let thirdArray = []
      // console.log(secondArray)
      secondArray.map((item) => {
        let f = firstArray.tags.filter(i => i === item)
        if (f.length > 0) {
          thirdArray = [...thirdArray, f[0]]
        }
      })

      // console.log(thirdArray)
      if (thirdArray.length >= secondArray.length) {
        return firstArray
      } else {
        return null
      }
    }

    let findProducts = [];

    products.map((item) => {
      let findAbleProduct = findtag(item, body.subcategory)
      if (findAbleProduct !== null) {
        findProducts = [...findProducts, findAbleProduct]
      }
    })

    // console.log(findProducts)
    products = findProducts
    // const thirdArray = products.filter((elem) => {
    //   return elem.tags.some((ele) => {
    //   return ele === elem&& ele.monName === elem.monName;
    //     });
    // })

    // products = products.filter(item => item.category === body.subcategory)
  }



  products = products.slice(currentPageSize, currentPageSize + 8)

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    nextPageUrl: products.length > 7 ? url : null,
    prevPageUrl: currentPageSize !== 0 ? url2 : null

  });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find().sort({
    createdAt: -1
  });

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Images Start Here
  let images = [];
  let imagesLinks = [];

  req.body.images.map((item)=>{
    if(typeof item === 'string'){
      images.push(item);
    }
    else{
      imagesLinks = [...imagesLinks, item]
    }
  })


  if (images !== undefined) {
    // Deleting Images From Cloudinary

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }



  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const {
    rating,
    comment,
    productId,
    name,
    email
  } = req.body;

  const review = {
    name: name,
    email: email,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);


  product.reviews.push(review);
  product.numOfReviews = product.reviews.length;

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({
    validateBeforeSave: false
  });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId, {
      reviews,
      ratings,
      numOfReviews,
    }, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});