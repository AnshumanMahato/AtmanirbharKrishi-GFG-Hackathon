const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently ordered product
  const product = await Product.findById(req.params.productId);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}/my-products/?product=${
    //   req.params.productId
    // }&user=${req.user.id}&price=${product.price}`,
    success_url: `${req.protocol}://${req.get('host')}/my-products?alert=order`,
    cancel_url: `${req.protocol}://${req.get('host')}/product/${product.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.productId,
    line_items: [
      {
        name: `${product.name} Product`,
        description: product.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/products/${
            product.imageCover
          }`
        ],
        amount: product.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

const createOrderCheckout = async (req, session) => {
  console.log(session);
  const product = await Product.findById(session.client_reference_id).select(
    'name'
  );
  const user = await User.findOne({ email: session.customer_email }).select(
    'name email'
  );
  const price = session.amount_subtotal / 100;
  const order = await Order.create({
    product: product.id,
    user: user.id,
    price
  });
  order.product = product;
  order.user = user;
  const url = `${req.protocol}://${req.get('host')}/`;
  await new Email(user, url).sendReciept(order);
};

exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    console.log('event got');
    await createOrderCheckout(req, event.data.object);
  }

  res.status(200).json({ received: true });
};

exports.createOrder = factory.createOne(Order);
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);