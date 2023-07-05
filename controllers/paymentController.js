const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')('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');


exports.processPayment = catchAsyncErrors(async (req, res, next) => {

  // const myPayment = await stripe.paymentIntents.create({
  //   amount: req.body.amount,
  //   currency: "usd",
  //   metadata: {
  //     company: "Ecommerce",
  //   },
   
  // });

  const myPayment = await stripe.paymentIntents.create({
    amount: parseInt(req.body.amount),
    currency: 'gbp',
    automatic_payment_methods: {enabled: true},
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
