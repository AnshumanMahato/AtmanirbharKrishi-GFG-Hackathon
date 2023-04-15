/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51MwelcSHRaMUMUayAPn386PipkteiTpz21MA4xr3fBYlDcxEFYWCgmkvLxE0Yh6pYDTNy83DVIBZcKZCmy40pgfm00ErHtSzWD'
);
export const orderProduct = async productId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/orders/checkout-session/${productId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
