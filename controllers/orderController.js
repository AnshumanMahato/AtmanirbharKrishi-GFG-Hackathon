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
  const test = `${req.protocol}://${req.get('host')}/img/${product.type}/${
    product.imageCover
  }`;
  console.log(test);
  const qty = Number(req.query?.qty);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?alert=order`,
    cancel_url: `${req.protocol}://${req.get('host')}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.productId,
    shipping_address_collection: {
      allowed_countries: ['IN']
    },
    line_items: [
      {
        price_data: {
          currency: 'inr',
          unit_amount: parseInt(product.pricePerKg * 100),
          product_data: {
            name: `${product.name} Product`,
            description: product.name,
            images: [
              `${req.protocol}://${req.get('host')}/img/${product.type}/${
                product.imageCover
              }`
            ]
          }
        },
        quantity: qty || 1,
        adjustable_quantity: {
          enabled: true
        }
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
  const product = await Product.findById(session.client_reference_id).select(
    'name'
  );
  const user = await User.findOne({ email: session.customer_email }).select(
    'name email'
  );
  const price = session.amount_subtotal / 100;
  const shipping_address = session.shipping_details.address;
  const order = await Order.create({
    product: product.id,
    user: user.id,
    price,
    shipping_address
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
